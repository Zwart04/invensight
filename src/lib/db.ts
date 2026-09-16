'use client';
import { useState, useEffect, useCallback } from 'react';
const STORAGE_PROD = 'inv_prod';
const STORAGE_SUPP = 'inv_supp';
const STORAGE_ORD = 'inv_ord';
const STORAGE_CAT = 'inv_cat';
const STORAGE_SHARE = 'inv_share';

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    if (Array.isArray(data) && Array.isArray(fallback)) return data as T;
    if (!Array.isArray(data)) return data as T;
    return fallback;
  } catch { return fallback; }
}

function save<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function genId() { return crypto.randomUUID(); }

export function useDB() {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const seed = useCallback(() => {
    const cats = load<any[]>(STORAGE_CAT, []);
    if (cats.length === 0) {
      const now = new Date().toISOString();
      const catData: any[] = [
        { id: genId(), name: 'Electronics', color: '#3b82f6', createdAt: now },
        { id: genId(), name: 'Furniture', color: '#10b981', createdAt: now },
        { id: genId(), name: 'Apparel', color: '#f59e0b', createdAt: now },
        { id: genId(), name: 'Food', color: '#ef4444', createdAt: now },
      ];
      save(STORAGE_CAT, catData);
    }
    const prods = load<any[]>(STORAGE_PROD, []);
    if (prods.length === 0) {
      const supData: any[] = [
        { id: genId(), name: 'TechParts Indonesia', email: 'sales@techparts.id', phone: '+62 21 555 0101', address: 'Jakarta Selatan', notes: 'Main electronics supplier', contactPerson: 'Agus Pratama', lastOrder: '', activeOrders: 0 },
        { id: genId(), name: 'Mega Furnituresupply', email: 'order@megafurniture.co.id', phone: '+62 21 555 0202', address: 'Bandung', notes: 'Furniture & home goods', contactPerson: 'Sari Dewi', lastOrder: '', activeOrders: 0 },
        { id: genId(), name: 'Textile Hub Makmur', email: 'info@textilehub.co.id', phone: '+62 21 555 0303', address: 'Surabaya', notes: 'Apparel & fabric', contactPerson: 'Rina Putri', lastOrder: '', activeOrders: 0 },
        { id: genId(), name: 'FreshFood Distributors', email: 'cs@freshfood.co.id', phone: '+62 21 555 0404', address: 'Bogor', notes: 'Perishable food items', contactPerson: 'Budi Hartono', lastOrder: '', activeOrders: 0 },
      ];
      save(STORAGE_SUPP, supData);
      const now2 = new Date();
      const prodData: any[] = [
        { id: genId(), name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', quantity: 145, price: 25, location: 'A1-01', minStock: 50, maxStock: 200, supplierId: supData[0].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'USB-C Hub 7-in-1', sku: 'UH-002', category: 'Electronics', quantity: 32, price: 45, location: 'A1-02', minStock: 20, maxStock: 100, supplierId: supData[0].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Ergonomic Office Chair', sku: 'OC-003', category: 'Furniture', quantity: 18, price: 280, location: 'B2-01', minStock: 10, maxStock: 50, supplierId: supData[1].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Standing Desk', sku: 'SD-004', category: 'Furniture', quantity: 7, price: 550, location: 'B2-02', minStock: 5, maxStock: 30, supplierId: supData[1].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Cotton T-Shirt L', sku: 'CT-005', category: 'Apparel', quantity: 520, price: 12, location: 'C3-01', minStock: 200, maxStock: 1000, supplierId: supData[2].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Denim Jacket M', sku: 'DJ-006', category: 'Apparel', quantity: 45, price: 65, location: 'C3-02', minStock: 20, maxStock: 100, supplierId: supData[2].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Organic Rice 5kg', sku: 'OR-007', category: 'Food', quantity: 88, price: 18, location: 'D4-01', minStock: 50, maxStock: 200, supplierId: supData[3].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Canned Sardines', sku: 'CS-008', category: 'Food', quantity: 230, price: 3.5, location: 'D4-02', minStock: 100, maxStock: 500, supplierId: supData[3].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'Mechanical Keyboard', sku: 'MK-009', category: 'Electronics', quantity: 8, price: 120, location: 'A1-03', minStock: 10, maxStock: 40, supplierId: supData[0].id, updatedAt: now2.toISOString() },
        { id: genId(), name: 'LED Desk Lamp', sku: 'DL-010', category: 'Electronics', quantity: 0, price: 35, location: 'A1-04', minStock: 15, maxStock: 60, supplierId: supData[0].id, updatedAt: now2.toISOString() },
      ];
      save(STORAGE_PROD, prodData);
    }
  }, []);

  useEffect(() => { seed(); }, [seed]);

  const addProduct = (p: Omit<any, 'id' | 'updatedAt'>) => {
    const arr = load<any[]>(STORAGE_PROD, []);
    const np: any = { ...p, id: genId(), updatedAt: new Date().toISOString() };
    arr.push(np);
    save(STORAGE_PROD, arr);
    setProducts([...arr]);
    return np;
  };

  const updateProduct = (id: string, data: Partial<any>) => {
    const arr = load<any[]>(STORAGE_PROD, []);
    const idx = arr.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...data, updatedAt: new Date().toISOString() };
    save(STORAGE_PROD, arr);
    setProducts([...arr]);
    return arr[idx];
  };

  const deleteProduct = (id: string) => {
    const arr = load<any[]>(STORAGE_PROD, []);
    save(STORAGE_PROD, arr.filter((p: any) => p.id !== id));
    const oarr = load<any[]>(STORAGE_ORD, []);
    save(STORAGE_ORD, oarr.filter((o: any) => o.productId !== id));
    setProducts(arr.filter((p: any) => p.id !== id));
  };

  const addOrder = (o: Omit<any, 'id'>) => {
    const arr = load<any[]>(STORAGE_ORD, []);
    const no: any = { ...o, id: genId() };
    arr.push(no);
    save(STORAGE_ORD, arr);
    setOrders([...arr]);
    return no;
  };

  const updateOrderStatus = (id: string, status: any) => {
    const arr = load<any[]>(STORAGE_ORD, []);
    const idx = arr.findIndex((o: any) => o.id === id);
    if (idx === -1) return null;
    arr[idx].status = status;
    save(STORAGE_ORD, arr);
    setOrders([...arr]);
    return arr[idx];
  };

  const addSupplier = (s: Omit<any, 'id' | 'lastOrder' | 'activeOrders'>) => {
    const arr = load<any[]>(STORAGE_SUPP, []);
    const ns: any = { ...s, id: genId(), lastOrder: '', activeOrders: 0 };
    arr.push(ns);
    save(STORAGE_SUPP, arr);
    setSuppliers([...arr]);
    return ns;
  };

  const updateSupplier = (id: string, data: Partial<any>) => {
    const arr = load<any[]>(STORAGE_SUPP, []);
    const idx = arr.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...data };
    save(STORAGE_SUPP, arr);
    setSuppliers([...arr]);
    return arr[idx];
  };

  const deleteSupplier = (id: string) => {
    const arr = load<any[]>(STORAGE_SUPP, []);
    save(STORAGE_SUPP, arr.filter((s: any) => s.id !== id));
    const oarr = load<any[]>(STORAGE_ORD, []);
    save(STORAGE_ORD, oarr.filter((o: any) => o.supplierId !== id));
    setSuppliers(arr.filter((s: any) => s.id !== id));
  };

  const addCategory = (c: Omit<any, 'id' | 'createdAt'>) => {
    const arr = load<any[]>(STORAGE_CAT, []);
    const nc: any = { ...c, id: genId(), createdAt: new Date().toISOString() };
    arr.push(nc);
    save(STORAGE_CAT, arr);
    setCategories([...arr]);
    return nc;
  };

  const deleteCategory = (id: string) => {
    const arr = load<any[]>(STORAGE_CAT, []);
    save(STORAGE_CAT, arr.filter((c: any) => c.id !== id));
    setCategories(arr.filter((c: any) => c.id !== id));
  };

  return {
    products,
    suppliers,
    orders,
    categories,
    addProduct, updateProduct, deleteProduct,
    addOrder, updateOrderStatus,
    addSupplier, updateSupplier, deleteSupplier,
    addCategory, deleteCategory,
  };
}

// Separate hooks that subscribe to localStorage changes
export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const key = 'inv_prod';
    const loadData = () => {
      try { setProducts(JSON.parse(localStorage.getItem(key) || '[]')); }
      catch { setProducts([]); }
    };
    loadData();
    const handler = () => loadData();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return products;
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  useEffect(() => {
    const key = 'inv_supp';
    const loadData = () => {
      try { setSuppliers(JSON.parse(localStorage.getItem(key) || '[]')); }
      catch { setSuppliers([]); }
    };
    loadData();
    const handler = () => loadData();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return suppliers;
}

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    const key = 'inv_ord';
    const loadData = () => {
      try { setOrders(JSON.parse(localStorage.getItem(key) || '[]')); }
      catch { setOrders([]); }
    };
    loadData();
    const handler = () => loadData();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return orders;
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    const key = 'inv_cat';
    const loadData = () => {
      try { setCategories(JSON.parse(localStorage.getItem(key) || '[]')); }
      catch { setCategories([]); }
    };
    loadData();
    const handler = () => loadData();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return categories;
}

export function useShareStore() {
  const [share, setShare] = useState<any>(null);
  useEffect(() => {
    try { setShare(JSON.parse(localStorage.getItem('inv_share') || 'null')); } catch { setShare(null); }
    const handler = () => { try { setShare(JSON.parse(localStorage.getItem('inv_share') || 'null')); } catch {} };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return share;
}

export function setShareItem(data: any) {
  save('inv_share', { ...data, expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString() });
}

export function clearShare() {
  save('inv_share', null);
}

export function isShareExpired(item: any) {
  if (!item || !item.expiresAt) return false;
  return new Date(item.expiresAt) < new Date();
}

export function createStaticParams() {
  if (typeof window !== 'undefined') return [];
  return [];
}
