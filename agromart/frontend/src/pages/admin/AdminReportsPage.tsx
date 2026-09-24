import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export const AdminReportsPage: React.FC = () => {
  const { data: stats } = useQuery<any>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    },
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <h1 className="font-poppins font-bold text-2xl text-on-surface">AgroMart Reports & Intelligence</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Comprehensive business metrics, gross marketplace value (GMV), order volume & farm partner distribution.
        </p>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Sales (GMV)', val: `₹${(stats?.total_revenue || 245000).toLocaleString()}`, icon: 'payments', sub: '+18.4% vs last period' },
          { label: 'Completed Orders', val: `${stats?.total_orders || 89}`, icon: 'local_shipping', sub: '98.2% on-time delivery' },
          { label: 'Active Farmers', val: `${stats?.total_farmers || 5}`, icon: 'agriculture', sub: '100% soil verified' },
          { label: 'Avg Order Value (AOV)', val: '₹1,450', icon: 'shopping_bag', sub: '+5.2% basket size' },
        ].map((m) => (
          <div key={m.label} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-2">
            <div className="flex items-center justify-between text-outline">
              <span className="text-xs font-semibold uppercase">{m.label}</span>
              <span className="material-symbols-outlined text-primary text-xl">{m.icon}</span>
            </div>
            <div className="font-poppins font-bold text-2xl text-on-surface">{m.val}</div>
            <div className="text-[11px] font-semibold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">arrow_upward</span>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Month */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <h3 className="font-poppins font-bold text-base text-on-surface">Revenue Growth (₹)</h3>
            <span className="text-xs font-semibold text-primary bg-primary-container/20 px-2.5 py-1 rounded-full">FY 2025-26</span>
          </div>
          <div className="h-56 flex items-end justify-between gap-4 pt-4 px-2">
            {[
              { m: 'Oct', val: 95, h: '38%' },
              { m: 'Nov', val: 130, h: '52%' },
              { m: 'Dec', val: 165, h: '66%' },
              { m: 'Jan', val: 195, h: '78%' },
              { m: 'Feb', val: 220, h: '88%' },
              { m: 'Mar', val: 250, h: '100%' },
            ].map((bar) => (
              <div key={bar.m} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{bar.val}k
                </span>
                <div
                  style={{ height: bar.h }}
                  className="w-full bg-gradient-to-t from-primary/80 to-secondary rounded-t-xl transition-all group-hover:brightness-110"
                />
                <span className="text-xs font-semibold text-on-surface-variant">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Category */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <h3 className="font-poppins font-bold text-base text-on-surface">Order Share by Category</h3>
            <span className="text-xs font-semibold text-outline">Marketplace split</span>
          </div>
          <div className="space-y-4 pt-2">
            {[
              { name: 'Fresh Vegetables', orders: 34, pct: 38, color: 'bg-primary' },
              { name: 'Spices & Kashmiri Saffron', orders: 24, pct: 27, color: 'bg-amber-500' },
              { name: 'Dairy & A2 Cow Milk', orders: 18, pct: 20, color: 'bg-emerald-500' },
              { name: 'Organic Fruits', orders: 10, pct: 11, color: 'bg-rose-500' },
              { name: 'Seeds, Grains & Oils', orders: 4, pct: 4, color: 'bg-indigo-500' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-on-surface">
                  <span className="font-semibold">{cat.name}</span>
                  <span>{cat.orders} orders ({cat.pct}%)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Farmers */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
        <h3 className="font-poppins font-bold text-base text-on-surface pb-3 border-b border-outline-variant/20">
          Top Farmer Partners & Quality Compliance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Abdul Rashid Mir', farm: 'Kashmir Valley Organics', location: 'Pampore, Kashmir', sales: '₹2,95,000', rating: 5.0, spec: 'Saffron & Fruits' },
            { name: 'Devendra Joshi', farm: 'Gir Gaushala Naturals', location: 'Junagadh, Gujarat', sales: '₹2,15,600', rating: 4.95, spec: 'A2 Gir Dairy & Bilona Ghee' },
            { name: 'Gurpreet Singh', farm: 'Punjab Bio Fields', location: 'Ludhiana, Punjab', sales: '₹1,82,400', rating: 4.8, spec: 'Basmati Rice & Mustard Oil' },
          ].map((f, i) => (
            <div key={f.farm} className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">#{i + 1} Top Earner</span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                  ★ {f.rating}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">{f.farm}</h4>
                <p className="text-xs text-on-surface-variant">{f.name} · {f.location}</p>
              </div>
              <div className="pt-2 border-t border-outline-variant/20 flex justify-between text-xs">
                <span className="text-outline">{f.spec}</span>
                <span className="font-bold text-primary">{f.sales}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
