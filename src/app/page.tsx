'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useProducts } from '@/lib/db';
import { useOrders } from '@/lib/db';
import { useCategories } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Package, AlertTriangle, Clock, DollarSign, ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const { theme } = useTheme();
  const products = useProducts();
  const orders = useOrders();
  const categories = useCategories();

  const total = products.length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
  const zeroStock = products.filter(p => p.quantity === 0).length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const totalValue = products.reduce((s, p) => s + p.quantity * p.price, 0);

  const catData = categories.map(c => {
    const pInCat = products.filter(p => p.category === c.name);
    const val = pInCat.reduce((s, p) => s + p.quantity * p.price, 0);
    return { name: c.name, value: val, color: c.color };
  }).filter(d => d.value > 0);

  const catColors = catData.map(d => d.color);

  // 7-day trend mock
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const base = products.reduce((s, p) => s + p.quantity, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), stock: Math.round(base * (0.85 + Math.random() * 0.3)) };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t['dashboard.welcome']}</h1>
          <p className="text-muted-foreground">{t['dashboard.recentActivity']}</p>
        </div>
        <Link href="/inventory">
          <Button className="gap-2">
            {t['nav.inventory']} <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={<Package size={20} />} label={t['dashboard.totalProducts']} value={total} />
        <KPI icon={<AlertTriangle size={20} />} label={t['dashboard.lowStock']} value={`${lowStock} / ${total}`} sub={`${zeroStock} ${t['dashboard.outOfStock'].toLowerCase()}`} color="text-amber-400" />
        <KPI icon={<Clock size={20} />} label={t['dashboard.pendingOrders']} value={pendingOrders} />
        <KPI icon={<DollarSign size={20} />} label={t['dashboard.totalValue']} value={`$${totalValue.toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart: stock by category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 size={16} />{t['inventory.barChart']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {catData.map((_, i) => <Cell key={i} fill={catColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart: stock distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp size={16} />{t['inventory.heatmap']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: t['dashboard.legend.good'], value: products.filter(p => p.quantity > p.minStock).length, color: '#10b981' },
                      { name: t['dashboard.legend.low'], value: lowStock, color: '#f59e0b' },
                      { name: t['dashboard.legend.out'], value: zeroStock, color: '#ef4444' },
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
            <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />{t['dashboard.legend.good']}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />{t['dashboard.legend.low']}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />{t['dashboard.legend.out']}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stock trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp size={16} />{t['inventory.trend']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="stock" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} fill="url(#gradient)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color || 'bg-primary/20 text-primary'}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}
