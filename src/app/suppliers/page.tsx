'use client';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useSuppliers } from '@/lib/db';
import { useProducts } from '@/lib/db';
import { useOrders } from '@/lib/db';
import { useToast } from '@/lib/toast';
import SuppliersPage from '@/components/suppliers-page';
import RedirectToAuth from '@/components/redirect-to-auth';

export default function SuppliersRoute() {
  const { t } = useLang();
  const { user } = useAuth();
  const suppliers = useSuppliers();
  const products = useProducts();
  const orders = useOrders();
  const { addToast } = useToast();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RedirectToAuth />
      </div>
    );
  }

  return (
    <SuppliersPage
      suppliers={suppliers}
      products={products}
      orders={orders}
      addToast={addToast}
    />
  );
}
