'use client';
import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { LayoutDashboard, Package, ShoppingCart, Warehouse, BarChart3, Settings, Tag, Share2, LogOut, Box } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import LangToggle from '@/components/lang-toggle';
import { usePathname } from 'next/navigation';

const icons = {
  dashboard: LayoutDashboard,
  inventory: Package,
  orders: ShoppingCart,
  suppliers: Warehouse,
  analytics: BarChart3,
  settings: Settings,
  categories: Tag,
  share: Share2,
};

export default function Navbar({ currentPage, onNavigate, onLogout }: { currentPage: string; onNavigate: (p: any) => void; onLogout: () => void }) {
  const { t } = useLang();
  const pathname = usePathname();
  const links = [
    { key: 'dashboard', label: t['nav.dashboard'], href: '/' },
    { key: 'inventory', label: t['nav.inventory'], href: '/inventory' },
    { key: 'orders', label: t['nav.orders'], href: '/orders' },
    { key: 'suppliers', label: t['nav.suppliers'], href: '/suppliers' },
    { key: 'analytics', label: t['nav.analytics'], href: '/analytics' },
    { key: 'categories', label: t['categories.title'], href: '/categories' },
    { key: 'share', label: t['nav.share'], href: '/share' },
    { key: 'settings', label: t['nav.settings'], href: '/settings' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect width="48" height="48" rx="10" fill="hsl(var(--primary))"/>
            <path d="M10 14h28M10 24h28M10 34h18" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <span className="hidden sm:inline">InvenSight</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {links.map(link => {
            const Icon = icons[link.key];
            const isActive = currentPage === link.key || (link.href === '/' && currentPage === 'dashboard');
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => onNavigate(link.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <LangToggle />
          <button onClick={onLogout} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title={t['nav.logout']}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
