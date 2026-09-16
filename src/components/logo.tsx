import { Package } from 'lucide-react';

interface LogoProps { variant?: 'default' | 'icon' }
export function Logo({ variant = 'default' }: LogoProps) {
  if (variant === 'icon') {
    return <Package className="h-6 w-6" />;
  }
  return (
    <div className="flex items-center gap-2">
      <Package className="h-7 w-7 text-primary" />
      <span className="text-lg font-semibold tracking-tight">InvenSight</span>
    </div>
  );
}
