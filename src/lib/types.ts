export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  minStock: number;
  maxStock: number;
  supplierId: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  contactPerson: string;
  lastOrder: string;
  activeOrders: number;
}

export interface Order {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'received' | 'cancelled' | 'delayed';
  date: string;
  total: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'default' | 'success' | 'error' | 'info';
}
