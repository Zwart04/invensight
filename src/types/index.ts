export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  minStock: number;
  maxStock: number;
  location: string;
  supplier: string;
  cost: number;
  price: number;
  lastUpdated: string;
  lowStock: boolean;
  expiring?: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'return';
  qty: number;
  reference: string;
  userId: string;
  timestamp: string;
}

export interface FinanceJournalEntry {
  id: string;
  date: string;
  source: 'auto-task' | 'auto-bill' | 'auto-vendor' | 'manual';
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  linkedItemId?: string;
  status: 'posted' | 'pending' | 'cancelled';
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'overstock' | 'expiring' | 'reorder_recommendation';
  itemId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
}

export interface AnalyticsSummary {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
  totalTurnover: number;
  topCategories: { category: string; count: number; value: number }[];
  stockDistribution: { range: string; count: number }[];
  recentActivity: Transaction[];
  alerts: Alert[];
  restockPredictions: { itemId: string; itemName: string; predictedDate: string; confidence: number }[];
}
