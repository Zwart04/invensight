'use client';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useProducts } from '@/lib/db';
import { useSuppliers } from '@/lib/db';
import { useOrders } from '@/lib/db';
import { useToast } from '@/lib/toast';
import OrdersPage from '@/components/orders-page';
import RedirectToAuth from '@/components/redirect-to-auth';

export default function OrdersRoute() {
  const { t } = useLang();
  const { user } = useAuth();
  const products = useProducts();
  const suppliers = useSuppliers();
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
    <OrdersPage
      products={products}
      suppliers={suppliers}
      orders={orders}
      addToast={addToast}
    />
  );
}
