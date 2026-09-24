import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';

interface AdminStats {
  total_users: number;
  total_customers: number;
  total_farmers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  pending_farmers: number;
}

interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string;
  total: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  created_at?: string;
}

export const AdminDashboardPage: React.FC = () => {
  const qc = useQueryClient();

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    },
  });

  const { data: recentOrders } = useQuery<AdminOrder[]>({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data?.slice(0, 6) || [];
    },
  });

  const { data: farmers } = useQuery<any[]>({
    queryKey: ['admin-farmers'],
    queryFn: async () => {
      const res = await api.get('/admin/farmers');
      return res.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (farmerId: string) => {
      const res = await api.patch(`/admin/farmers/${farmerId}/approve`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-farmers'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const pendingFarmers = farmers?.filter((f) => f.status === 'pending_approval') || [];

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString('en-IN')}`,
      icon: 'currency_rupee',
      gradient: 'from-emerald-600 to-green-800',
      change: '+14.2%',
    },
    {
      label: 'Total Orders',
      value: (stats?.total_orders || 0).toLocaleString(),
      icon: 'receipt_long',
      gradient: 'from-blue-600 to-indigo-800',
      change: '+9.1%',
    },
    {
      label: 'Pending Orders',
      value: (stats?.pending_orders || 0).toLocaleString(),
      icon: 'pending_actions',
      gradient: 'from-amber-600 to-orange-700',
      change: 'Action needed',
    },
    {
      label: 'Total Customers',
      value: (stats?.total_customers || 3).toLocaleString(),
      icon: 'people',
      gradient: 'from-purple-600 to-pink-800',
      change: '+12.5%',
    },
    {
      label: 'Total Farmers',
      value: (stats?.total_farmers || 5).toLocaleString(),
      icon: 'agriculture',
      gradient: 'from-teal-600 to-emerald-800',
      change: '+2 this week',
    },
    {
      label: 'Pending Approvals',
      value: (stats?.pending_farmers || pendingFarmers.length).toLocaleString(),
      icon: 'verified_user',
      gradient: 'from-rose-600 to-red-800',
      change: pendingFarmers.length > 0 ? 'Requires Review' : 'All Approved',
    },
    {
      label: 'Total Products',
      value: (stats?.total_products || 25).toLocaleString(),
      icon: 'inventory_2',
      gradient: 'from-sky-600 to-cyan-800',
      change: 'Active catalog',
    },
  ];

  const ORDER_STATUS_COLORS: Record<string, string> = {
    placed: 'bg-blue-50 text-blue-700 border-blue-200',
    packed: 'bg-amber-50 text-amber-700 border-amber-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const PAYMENT_COLORS: Record<string, string> = {
    paid: 'text-secondary font-bold',
    pending: 'text-outline',
    pending_cod: 'text-amber-600 font-bold',
    failed: 'text-error font-bold',
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl p-8 text-on-primary shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-on-primary/80 uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-sm">shield_person</span>
            Master Administrator Panel
          </div>
          <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-white">AgroMart Platform Control</h1>
          <p className="text-on-primary/80 text-sm mt-2 max-w-xl">
            Real-time control center for managing farmers, customers, agricultural catalog, orders, and sales revenue.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -right-2 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`relative bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-md overflow-hidden hover:scale-[1.02] transition-transform`}
          >
            <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
            <span className="material-symbols-outlined text-2xl text-white/90 relative z-10">{card.icon}</span>
            <div className="mt-3 relative z-10">
              <div className="font-poppins font-bold text-2xl">{card.value}</div>
              <div className="text-xs text-white/80 font-medium mt-0.5">{card.label}</div>
              <div className="text-[11px] font-semibold text-white/90 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Farmer Approvals Section */}
      {pendingFarmers.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-poppins font-bold text-lg">
              <span className="material-symbols-outlined text-amber-600 text-2xl animate-pulse">notification_important</span>
              Pending Farmer Approvals ({pendingFarmers.length})
            </div>
            <Link to="/admin/farmers" className="text-xs font-bold text-amber-800 hover:underline">
              Manage All Farmers →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingFarmers.map((f) => (
              <div
                key={f.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-poppins font-bold text-sm text-on-surface">{f.farm_name}</h4>
                  <p className="text-xs text-on-surface-variant">Owner: {f.name} · {f.district}, {f.state}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {f.farming_type}
                  </span>
                </div>
                <button
                  onClick={() => approveMutation.mutate(f.id)}
                  disabled={approveMutation.isPending}
                  className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales & Orders Chart Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div>
              <h3 className="font-poppins font-bold text-lg text-on-surface">Revenue & Sales Trends</h3>
              <p className="text-xs text-on-surface-variant">Monthly revenue performance across all verified farms</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-primary hover:underline">
              Full Analytics →
            </Link>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { month: 'Oct', revenue: 95000, height: '40%' },
              { month: 'Nov', revenue: 125000, height: '55%' },
              { month: 'Dec', revenue: 160000, height: '70%' },
              { month: 'Jan', revenue: 195000, height: '82%' },
              { month: 'Feb', revenue: 220000, height: '90%' },
              { month: 'Mar', revenue: 245000, height: '100%' },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{(bar.revenue / 1000).toFixed(0)}k
                </span>
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-gradient-to-t from-primary/80 to-secondary rounded-t-lg transition-all group-hover:brightness-110"
                />
                <span className="text-xs font-semibold text-on-surface-variant">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1 space-y-4">
          <h3 className="font-poppins font-bold text-lg text-on-surface pb-3 border-b border-outline-variant/20">
            Top Categories
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Spices & Saffron', pct: 35, color: 'bg-amber-500' },
              { name: 'Dairy Products', pct: 25, color: 'bg-emerald-500' },
              { name: 'Fresh Vegetables', pct: 20, color: 'bg-green-600' },
              { name: 'Organic Fruits', pct: 12, color: 'bg-rose-500' },
              { name: 'Grains & Seeds', pct: 8, color: 'bg-indigo-500' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-on-surface">
                  <span>{cat.name}</span>
                  <span className="font-bold">{cat.pct}%</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <h2 className="font-poppins font-semibold text-on-surface text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">table_view</span>
            Recent Orders
          </h2>
          <Link to="/admin/orders" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
            View All Orders <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Order #</th>
                  <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Payment</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-on-surface">#{order.order_number}</span>
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant hidden sm:table-cell">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] border rounded-full px-2.5 py-0.5 font-semibold capitalize ${
                          ORDER_STATUS_COLORS[order.order_status] || ''
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-xs capitalize ${PAYMENT_COLORS[order.payment_status] || ''}`}>
                        {order.payment_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-primary">
                      ₹{order.total.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl block mb-2 opacity-40">receipt_long</span>
            <p>No orders yet on the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
};
