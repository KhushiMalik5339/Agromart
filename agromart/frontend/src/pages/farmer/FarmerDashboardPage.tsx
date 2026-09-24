import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { FarmerProfile } from '../../services/dataService';
import { Order } from '../../types';

export const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: profile } = useQuery<FarmerProfile>({
    queryKey: ['farmer-profile'],
    queryFn: async () => {
      const res = await api.get('/farmer/profile');
      return res.data;
    },
  });

  const { data: analytics } = useQuery<any>({
    queryKey: ['farmer-analytics'],
    queryFn: async () => {
      const res = await api.get('/farmer/analytics');
      return res.data;
    },
  });

  const { data: recentOrders } = useQuery<Order[]>({
    queryKey: ['farmer-orders'],
    queryFn: async () => {
      const res = await api.get('/farmer/orders');
      return res.data?.slice(0, 5) || [];
    },
  });

  const isApproved = profile?.status === 'approved';
  const isPending = profile?.status === 'pending_approval';

  const statCards = [
    {
      label: 'Total Revenue',
      val: `₹${(analytics?.total_revenue || 0).toLocaleString('en-IN')}`,
      icon: 'currency_rupee',
      color: 'bg-emerald-600 text-white',
      desc: 'All-time gross sales',
    },
    {
      label: 'Received Orders',
      val: `${analytics?.total_orders || 0}`,
      icon: 'shopping_bag',
      color: 'bg-blue-600 text-white',
      desc: 'Customer farm orders',
    },
    {
      label: 'Pending Orders',
      val: `${analytics?.pending_orders || 0}`,
      icon: 'pending_actions',
      color: 'bg-amber-600 text-white',
      desc: 'Orders to pack & dispatch',
    },
    {
      label: 'Products Listed',
      val: `${analytics?.active_products || 0}`,
      icon: 'inventory_2',
      color: 'bg-primary text-white',
      desc: 'Catalog items online',
    },
    {
      label: 'Available Stock',
      val: `${analytics?.available_stock || 0}`,
      icon: 'warehouse',
      color: 'bg-purple-600 text-white',
      desc: 'Units ready for sale',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Farm Status Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 card-elevation-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center font-bold text-2xl">
            <span className="material-symbols-outlined text-3xl">agriculture</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-poppins font-bold text-2xl text-on-surface">
                {profile?.farm_name || `${user?.name}'s Organic Farm`}
              </h1>
              {isApproved && (
                <span className="bg-secondary-container/80 text-on-secondary-container text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Verified Farm
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {profile?.village ? `${profile.village}, ` : ''}{profile?.district || 'Nashik'}, {profile?.state || 'Maharashtra'} · {profile?.farming_type || '100% Certified Organic'}
            </p>
          </div>
        </div>

        <Link
          to="/farmer/products"
          className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 self-start md:self-center"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add New Produce
        </Link>
      </div>

      {/* Admin Approval Notice (if pending) */}
      {isPending && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0 mt-0.5 animate-pulse">
            hourglass_top
          </span>
          <div>
            <h4 className="font-poppins font-bold text-sm text-amber-900">
              Account Pending Admin Approval
            </h4>
            <p className="text-xs text-amber-800/90 mt-1">
              Your farm registration is currently under review by our AgroMart administrator. You can prepare your produce listings in advance, which will automatically go live across the marketplace as soon as your account is approved.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((c) => (
          <div
            key={c.label}
            className={`${c.color} p-4 rounded-2xl shadow-md space-y-2 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between opacity-80">
              <span className="text-[11px] font-bold uppercase tracking-wider">{c.label}</span>
              <span className="material-symbols-outlined text-xl">{c.icon}</span>
            </div>
            <div className="font-poppins font-bold text-2xl">{c.val}</div>
            <div className="text-[10px] opacity-80">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Sales Growth Chart */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
          <div>
            <h3 className="font-poppins font-bold text-base text-on-surface">Monthly Harvest Revenue</h3>
            <p className="text-xs text-on-surface-variant">Earnings generated from your direct farm sales</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary-container/15 px-3 py-1 rounded-full">
            Direct Bank Payout
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
          {(analytics?.monthly_sales || [
            { month: 'Jan', sales: 14000 },
            { month: 'Feb', sales: 22000 },
            { month: 'Mar', sales: 38500 },
          ]).map((bar: any) => {
            const maxVal = Math.max(...(analytics?.monthly_sales || [{ sales: 40000 }]).map((b: any) => b.sales), 40000);
            const heightPct = `${Math.min(100, Math.round((bar.sales / maxVal) * 100))}%`;
            return (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{bar.sales.toLocaleString()}
                </span>
                <div
                  style={{ height: heightPct }}
                  className="w-full bg-gradient-to-t from-primary/80 to-secondary rounded-t-xl transition-all group-hover:brightness-110"
                />
                <span className="text-xs font-semibold text-on-surface-variant">{bar.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders for Farmer */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <div>
            <h2 className="font-poppins font-bold text-on-surface text-base">Recent Orders Received</h2>
            <p className="text-xs text-on-surface-variant">Direct orders containing crops from your farm</p>
          </div>
          <Link to="/farmer/orders" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
            Manage All Orders →
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Order</th>
                  <th className="text-left px-5 py-3 font-semibold">Items</th>
                  <th className="text-left px-5 py-3 font-semibold">Destination</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-on-surface">
                      #{order.order_number}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-on-surface-variant">
                      {order.items.map((i) => `${i.title} (${i.qty} ${i.unit})`).join(', ')}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-on-surface-variant">
                      {order.address?.city}, {order.address?.state}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-semibold border rounded-full px-2.5 py-0.5 capitalize bg-primary-container/15 text-primary border-primary/30">
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-primary">
                      ₹{order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">inventory</span>
            <p>No orders received yet. Make sure your produce is in stock!</p>
          </div>
        )}
      </div>
    </div>
  );
};
