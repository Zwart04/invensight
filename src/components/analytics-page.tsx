'use client';
import { useMemo } from 'react';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Badge } from '@/components/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, DollarSign, TrendingUp, AlertTriangle, Package, Users, Calendar } from 'lucide-react';
import { useMemo as um } from 'react';

export default function AnalyticsPage({ products, orders, categories }: { products: any[]; orders: any[]; categories: any[] }) {
  const { t } = useLang();
  const { user } = useAuth();

  const totalValue = useMemo(() => products.reduce((s, p) => s + p.quantity * p.price, 0), [products]);
  const lowStockCount = useMemo(() => products.filter(p => p.quantity <= p.minStock).length, [products]);
  const outOfStockCount = useMemo(() => products.filter(p => p.quantity === 0).length, [products]);

  // Category breakdown (value)
  const catBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + p.quantity * p.price; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Category colors
  const catColors = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach(c => { map[c.name] = c.color; });
    return map;
  }, [categories]);

  // Stock level distribution
  const stockDist = useMemo(() => [
    { name: t['analytics.lowStockItems'], value: products.filter(p => p.quantity === 0).length, color: '#ef4444' },
    { name: t['dashboard.legend.low'].charAt(0).toUpperCase() + t['dashboard.legend.low'].slice(1), value: products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length, color: '#f59e0b' },
    { name: t['dashboard.legend.good'], value: products.filter(p => p.quantity > p.minStock).length, color: '#10b981' },
  ], [products]);

  // Monthly trend (mock 6-month with growth pattern)
  const monthlyTrend = useMemo(() => {
    const base = products.reduce((s, p) => s + p.quantity, 0);
    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5 - i));
      const label = month.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      const v = Math.round(base * (0.6 + (i * 0.1) + Math.random() * 0.15));
      return { month: label, stock: v, value: v * 15 };
    });
  }, [products]);

  // Top products by value
  const topProducts = useMemo(() => {
    return [...products].sort((a, b) => b.quantity * b.price - a.quantity * a.price).slice(0, 5).map(p => ({
      name: p.name,
      value: p.quantity * p.price,
      qty: p.quantity,
    }));
  }, [products]);

  // Order status counts
  const orderStats = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, confirmed: 0, received: 0, cancelled: 0, delayed: 0 };
    orders.forEach(o => { counts[o.status]++; });
    return counts;
  }, [orders]);

  const catColorArray = catBreakdown.map(e => catColors[e.name] || '#6b7280');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t['analytics.title']}</h1>
        <p className="text-muted-foreground mt-1">{t['analytics.inventoryOverview']}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<DollarSign size={20} />} label={t['analytics.stockValue']} value={`$${totalValue.toLocaleString()}`} color="bg-emerald-500/20 text-emerald-400" />
        <KpiCard icon={<AlertTriangle size={20} />} label={t['analytics.lowStockItems']} value={lowStockCount} sub={`${outOfStockCount} ${t['dashboard.outOfStock'].toLowerCase()}`} color="bg-amber-500/20 text-amber-400" />
        <KpiCard icon={<TrendingUp size={20} />} label={t['analytics.monthlyTrend'].split(' ')[0]} value="+" + Math.round(Math.random() * 15 + 5) + "%" color="bg-blue-500/20 text-blue-400" />
        <KpiCard icon={<BarChart3 size={20} />} label={t['analytics.totalOrders']} value={orders.length} sub={`${orderStats.confirmed} ${t['analytics.confirmedOrders'].toLowerCase()}`} color="bg-purple-500/20 text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t['analytics.categoryBreakdown']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {catBreakdown.map((_, i) => <Cell key={i} fill={catColorArray[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
              {catBreakdown.map((e, i) => (
                <span key={e.name} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: catColorArray[i] }} />
                  {e.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock level distribution pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t['analytics.stockLevelDistribution']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={5} dataKey="value">
                    {stockDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
              {stockDist.map(e => (
                <span key={e.name} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                  {e.name} ({e.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t['analytics.monthlyTrend']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="stock" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorStock)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t['analytics.topProducts']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
