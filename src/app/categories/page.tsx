'use client';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useCategories } from '@/lib/db';
import { useProducts } from '@/lib/db';
import { useToast } from '@/lib/toast';
import CategoriesPage from '@/components/categories-page';
import RedirectToAuth from '@/components/redirect-to-auth';

export default function CategoriesRoute() {
  const { t } = useLang();
  const { user } = useAuth();
  const categories = useCategories();
  const products = useProducts();
  const { addToast } = useToast();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RedirectToAuth />
      </div>
    );
  }

  return (
    <CategoriesPage
      categories={categories}
      products={products}
      addToast={addToast}
    />
  );
}
