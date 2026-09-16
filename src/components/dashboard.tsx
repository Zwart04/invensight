'use client';
import { useLang } from '@/lib/lang';
import { Package, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useMemo } from 'react';

export default function Dashboard({ products, orders, categories }: { products: any[]; orders: any[]; categories: any[] }) {
  const { t } = useLang();

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const totalValue = useMemo(() => products.reduce((acc, p) => acc + p.quantity * p.price, 0), [products]);
  const restockNeeded = products.filter(p => p.quantity <= p.minStock).length;

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    received: '#10b981',
    cancelled: '#ef4444',
    delayed: '#8b5cf6',
  };

  const orderStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({ name: status, value: count }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string }> = {};
    products.forEach(p => {
      if (!map[p.category]) {
        const cat = categories.find(c => c.name === p.category);
        map[p.category] = { name: p.category, value: p.quantity * p.price, color: cat?.color || '#6b7280' };
      } else {
        map[p.category].value += p.quantity * p.price;
      }
    });
    return Object.values(map);
  }, [products, categories]);

  // Generate 7-day trend (mock historical data based on current stock)
  const trendData = useMemo(() => {
    const base = products.reduce((s, p) => s + p.quantity, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      const variation = Math.round(base * (0.85 + Math.random() * 0.3));
      return { day: day.toLocaleDateString('en', { weekday: 'short' }), stock: variation, incoming: Math.round(variation * 0.15) };
    });
  }, [products]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t['dashboard.welcome']}</h1>
        <p className="text-muted-foreground mt-1">{t['dashboard.recentActivity']}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package size={20} />} label={t['dashboard.totalProducts']} value={totalProducts} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={<AlertTriangle size={20} />} label={t['dashboard.lowStock']} value={`${lowStock} / ${totalProducts}`} sub={`${outOfStock} ${t['dashboard.outOfStock']}`} color="bg-amber-500/20 text-amber-400" />
        <StatCard icon={<Clock size={20} />} label={t['dashboard.pendingOrders']} value={pendingOrders} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={<DollarSign size={20} />} label={t['dashboard.totalValue']} value={`$${totalValue.toLocaleString()}`} sub={`${restockNeeded} ${t['dashboard.restockNeeded'].toLowerCase()}`} color="bg-emerald-500/20 text-emerald-400" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardWithTitle title={t['inventory.barChart']}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t['inventory.barChart']}</p>
        </CardWithTitle>

        <CardWithTitle title={t['inventory.trend']}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Line type="monotone" dataKey="stock" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="incoming" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-hsl(var(--primary)) rounded" /> Current Stock</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 rounded" /> Incoming</span>
          </div>
        </CardWithTitle>
      </div>

      {/* Stock distribution + Orders status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardWithTitle title={t['inventory.heatmap']}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Good Stock', value: products.filter(p => p.quantity > p.minStock).length, color: '#10b981' },
                    { name: 'Low Stock', value: products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length, color: '#f59e0b' },
                    { name: 'Out of Stock', value: products.filter(p => p.quantity === 0).length, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {['#10b981', '#f59e0b', '#ef4444'].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400" />{t['dashboard.legend.good']}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400" />{t['dashboard.legend.low']}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400" />{t['dashboard.legend.out']}</span>
          </div>
        </CardWithTitle>

        <CardWithTitle title={t['analytics.restockAlerts']}>
          <div className="h-64 flex items-center justify-center">
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No order data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, i) => (
                      <Cell key={i} fill={statusColors[entry.name] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
            {Object.entries(statusColors).map(([status, color]) => (
              <span key={status} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            ))}
          </div>
        </CardWithTitle>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
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

function CardWithTitle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
