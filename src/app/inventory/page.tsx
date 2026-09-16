'use client';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useProducts } from '@/lib/db';
import { useSuppliers } from '@/lib/db';
import { useCategories } from '@/lib/db';
import { useToast } from '@/lib/toast';
import InventoryPage from '@/components/inventory-page';
import RedirectToAuth from '@/components/redirect-to-auth';

export default function InventoryRoute() {
  const { t } = useLang();
  const { user } = useAuth();
  const products = useProducts();
  const suppliers = useSuppliers();
  const categories = useCategories();
  const { addToast } = useToast();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RedirectToAuth />
      </div>
    );
  }

  return (
    <InventoryPage
      products={products}
      categories={categories}
      suppliers={suppliers}
      addToast={addToast}
      refresh={() => {}}
    />
  );
}
