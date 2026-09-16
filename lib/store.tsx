"use client";

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";

interface InventoryState {
  items: import("@/lib/data").StockItem[];
  suppliers: import("@/lib/data").Supplier[];
  alerts: import("@/lib/data").Alert[];
  finance: import("@/lib/data").FinanceEntry[];
  setItems: (items: import("@/lib/data").StockItem[]) => void;
  setSuppliers: (s: import("@/lib/data").Supplier[]) => void;
  setAlerts: (a: import("@/lib/data").Alert[]) => void;
  addAlert: (a: import("@/lib/data").Alert) => void;
  markAlertRead: (id: string) => void;
  addStockIn: (sku: string, qty: number, note?: string) => void;
  addStockOut: (sku: string, qty: number, note?: string) => void;
  addFinanceEntry: (e: import("@/lib/data").FinanceEntry) => void;
}

const StoreContext = createContext<InventoryState | null>(null);

const STORAGE_KEY_ITEMS = "iv_items_v1";
const STORAGE_KEY_SUPPLIERS = "iv_suppliers_v1";
const STORAGE_KEY_ALERTS = "iv_alerts_v1";
const STORAGE_KEY_FINANCE = "iv_finance_v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsRaw] = useState<import("@/lib/data").StockItem[]>([]);
  const [suppliers, setSuppliersRaw] = useState<import("@/lib/data").Supplier[]>([]);
  const [alerts, setAlertsRaw] = useState<import("@/lib/data").Alert[]>([]);
  const [finance, setFinanceRaw] = useState<import("@/lib/data").FinanceEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const itemsData = loadFromStorage(STORAGE_KEY_ITEMS, []);
    const suppliersData = loadFromStorage(STORAGE_KEY_SUPPLIERS, []);
    const alertsData = loadFromStorage(STORAGE_KEY_ALERTS, []);
    const financeData = loadFromStorage(STORAGE_KEY_FINANCE, []);
    setItemsRaw(itemsData as any);
    setSuppliersRaw(suppliersData as any);
    setAlertsRaw(alertsData as any);
    setFinanceRaw(financeData as any);
  }, [mounted]);

  const setItems = useCallback((val: import("@/lib/data").StockItem[]) => {
    setItemsRaw(val);
    saveToStorage(STORAGE_KEY_ITEMS, val);
  }, []);

  const setSuppliers = useCallback((val: import("@/lib/data").Supplier[]) => {
    setSuppliersRaw(val);
    saveToStorage(STORAGE_KEY_SUPPLIERS, val);
  }, []);

  const setAlerts = useCallback((val: import("@/lib/data").Alert[]) => {
    setAlertsRaw(val);
    saveToStorage(STORAGE_KEY_ALERTS, val);
  }, []);

  const addAlert = useCallback((alert: import("@/lib/data").Alert) => {
    const newAlerts = [alert, ...alerts];
    setAlertsRaw(newAlerts);
    saveToStorage(STORAGE_KEY_ALERTS, newAlerts);
  }, [alerts]);

  const markAlertRead = useCallback((id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
    setAlertsRaw(updated);
    saveToStorage(STORAGE_KEY_ALERTS, updated);
  }, [alerts]);

  const addStockIn = useCallback((sku: string, qty: number, note?: string) => {
    setItemsRaw((prev: any) => {
      const updated = prev.map((item: any) => {
        if (item.sku !== sku) return item;
        const newQty = item.quantity + qty;
        const transaction: import("@/lib/data").Transaction = {
          id: `t-in-${Date.now()}`,
          type: "in",
          quantity: qty,
          date: new Date().toISOString().split("T")[0],
          note,
        };
        return {
          ...item,
          quantity: newQty,
          lastTransaction: transaction.date,
          transactions: [...item.transactions, transaction].slice(-100),
          status: newQty === 0 ? "out_of_stock" :
            newQty <= item.minStock ? "ready_restock" :
            newQty <= item.minStock + 10 ? "minimal" : "normal",
        };
      });
      saveToStorage(STORAGE_KEY_ITEMS, updated);
      return updated;
    });

    const item = items.find((i) => i.sku === sku);
    if (item) {
      addAlert({
        id: `alert-${Date.now()}`,
        type: "stock_update",
        severity: "low",
        sku,
        message: `Stok ${item.name} ditambah ${qty} unit — total ${item.quantity + qty} unit`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      addFinanceEntry({
        id: `fin-${Date.now()}`,
        type: "auto-task",
        category: "Inventory Adjustment",
        description: `Stok masuk: ${item.name} +${qty} unit`,
        source: "invensight:auto-stok",
        amount: item.unitPrice * qty,
        ts: new Date().toISOString(),
      });
    }
  }, [items, addAlert, addFinanceEntry]);

  const addStockOut = useCallback((sku: string, qty: number, note?: string) => {
    setItemsRaw((prev: any) => {
      const updated = prev.map((item: any) => {
        if (item.sku !== sku) return item;
        const newQty = Math.max(0, item.quantity - qty);
        const transaction: import("@/lib/data").Transaction = {
          id: `t-out-${Date.now()}`,
          type: "out",
          quantity: qty,
          date: new Date().toISOString().split("T")[0],
          note,
        };
        return {
          ...item,
          quantity: newQty,
          lastTransaction: transaction.date,
          transactions: [...item.transactions, transaction].slice(-100),
          status: newQty === 0 ? "out_of_stock" :
            newQty <= item.minStock ? "ready_restock" :
            newQty <= item.minStock + 10 ? "minimal" : "normal",
        };
      });
      saveToStorage(STORAGE_KEY_ITEMS, updated);
      return updated;
    });

    const item = items.find((i) => i.sku === sku);
    if (item) {
      addAlert({
        id: `alert-${Date.now()}`,
        type: "stock_update",
        severity: item.quantity - qty <= item.minStock ? "high" : "medium",
        sku,
        message: `Stok ${item.name} dikurangi ${qty} unit — sisa ${Math.max(0, item.quantity - qty)} unit`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      addFinanceEntry({
        id: `fin-${Date.now()}`,
        type: "auto-task",
        category: "Inventory Adjustment",
        description: `Stok keluar: ${item.name} -${qty} unit`,
        source: "invensight:auto-stok",
        amount: -(item.unitPrice * qty),
        ts: new Date().toISOString(),
      });
    }
  }, [items, addAlert, addFinanceEntry]);

  const addFinanceEntry = useCallback((entry: import("@/lib/data").FinanceEntry) => {
    const newEntries = [entry, ...finance];
    setFinanceRaw(newEntries);
    saveToStorage(STORAGE_KEY_FINANCE, newEntries);
  }, [finance]);

  const value = useMemo(() => ({
    items,
    suppliers,
    alerts,
    finance,
    setItems,
    setSuppliers,
    setAlerts,
    addAlert,
    markAlertRead,
    addStockIn,
    addStockOut,
    addFinanceEntry,
  }), [items, suppliers, alerts, finance]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useInventory(): InventoryState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useInventory must be inside InventoryProvider");
  return ctx;
}
