import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

interface AdminStats {
  total_users: number;
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_farmers: number;
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
      const res = await api.get('/admin/orders?limit=8');
      return res.data;
    },
  });

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString('en-IN')}`,
      icon: 'currency_rupee',
      gradient: 'from-emerald-500 to-green-700',
      change: '+12.5%',
    },
    {
      label: 'Total Orders',
      value: (stats?.total_orders || 0).toLocaleString(),
      icon: 'receipt_long',
      gradient: 'from-blue-500 to-blue-700',
      change: '+8.2%',
    },
    {
      label: 'Total Users',
      value: (stats?.total_users || 0).toLocaleString(),
      icon: 'people',
      gradient: 'from-purple-500 to-purple-700',
      change: '+15.3%',
    },
    {
      label: 'Active Farmers',
      value: (stats?.total_farmers || 0).toLocaleString(),
      icon: 'agriculture',
      gradient: 'from-amber-500 to-orange-600',
      change: '+3.1%',
    },
    {
      label: 'Product Listings',
      value: (stats?.total_products || 0).toLocaleString(),
      icon: 'inventory_2',
      gradient: 'from-rose-500 to-pink-700',
      change: '+5.7%',
    },
  ];

  const ORDER_STATUS_COLORS: Record<string, string> = {
    placed:    'bg-blue-50 text-blue-700 border-blue-200',
    packed:    'bg-amber-50 text-amber-700 border-amber-200',
    shipped:   'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const PAYMENT_COLORS: Record<string, string> = {
    paid:        'text-secondary font-bold',
    pending:     'text-outline',
    pending_cod: 'text-amber-600 font-bold',
    failed:      'text-error font-bold',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl p-7 text-on-primary shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-on-primary/70 text-sm font-medium uppercase tracking-widest">Admin Console</p>
          <h1 className="font-poppins font-bold text-3xl mt-1">AgroMart Platform</h1>
          <p className="text-on-primary/70 text-sm mt-2">Full platform health & performance overview</p>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-12 w-56 h-56 rounded-full bg-white/5" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`relative bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg overflow-hidden`}>
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
            <span className="material-symbols-outlined text-2xl text-white/80 relative z-10">{card.icon}</span>
            <div className="mt-3 relative z-10">
              <div className="font-poppins font-bold text-xl">{card.value}</div>
              <div className="text-xs text-white/70 mt-0.5">{card.label}</div>
              <div className="text-[11px] font-semibold text-white/80 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                {card.change} this month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <h2 className="font-poppins font-semibold text-on-surface text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">table_view</span>
            Recent Orders
          </h2>
          <Link to="/admin/orders" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Order</th>
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
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] border rounded-full px-2.5 py-0.5 font-semibold capitalize ${ORDER_STATUS_COLORS[order.order_status] || ''}`}>
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
