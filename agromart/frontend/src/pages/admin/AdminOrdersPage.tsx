import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';

interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string;
  items: { title: string; qty: number; price: number; unit: string; image?: string }[];
  address: { line1: string; city: string; state: string; pincode: string };
  subtotal: number;
  gst: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  created_at?: string;
}

const ORDER_STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];

const STATUS_CONFIG: Record<string, { color: string; icon: string }> = {
  placed:    { color: 'bg-blue-50 text-blue-700 border-blue-200',    icon: 'receipt_long' },
  packed:    { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'inventory_2' },
  shipped:   { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'local_shipping' },
  delivered: { color: 'bg-green-50 text-green-700 border-green-200', icon: 'check_circle' },
  cancelled: { color: 'bg-red-50 text-red-700 border-red-200',       icon: 'cancel' },
};

const PAYMENT_CONFIG: Record<string, string> = {
  paid:        'text-secondary font-bold',
  pending:     'text-outline',
  pending_cod: 'text-amber-600 font-bold',
  failed:      'text-error font-bold',
};

export const AdminOrdersPage: React.FC = () => {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { order_status: status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const filtered = orders?.filter(o => {
    const matchSearch = !searchTerm
      || o.order_number.toLowerCase().includes(searchTerm.toLowerCase())
      || o.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.order_status === filterStatus;
    return matchSearch && matchStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">All Orders</h1>
          <p className="text-sm text-on-surface-variant">
            {orders?.length || 0} total orders on the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-3 material-symbols-outlined text-xl text-outline">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order number or user ID…"
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Status Summary Chips */}
      <div className="flex flex-wrap gap-2">
        {['all', ...ORDER_STATUSES].map((s) => {
          const count = s === 'all' ? orders?.length || 0 : orders?.filter(o => o.order_status === s).length || 0;
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                filterStatus === s
                  ? (cfg ? cfg.color : 'bg-primary text-on-primary border-primary')
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:border-primary/40'
              }`}
            >
              {cfg && <span className="material-symbols-outlined text-sm">{cfg.icon}</span>}
              <span className="capitalize">{s}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filterStatus === s ? 'bg-white/20' : 'bg-surface-container'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-surface-container-low rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl block mb-3 opacity-40">receipt_long</span>
          <p className="font-semibold">No orders match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const statusCfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.placed;
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full text-left p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors"
                >
                  {/* Status badge */}
                  <div className={`flex-shrink-0 hidden sm:flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[11px] font-bold ${statusCfg.color}`}>
                    <span className="material-symbols-outlined text-sm">{statusCfg.icon}</span>
                    <span className="capitalize">{order.order_status}</span>
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-poppins font-bold text-on-surface text-sm">#{order.order_number}</span>
                      <span className={`text-xs ${PAYMENT_CONFIG[order.payment_status] || ''}`}>
                        • {order.payment_status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                      {order.items.map(i => `${i.title} ×${i.qty}`).join(', ')}
                    </p>
                  </div>

                  {/* Date & Total */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-primary">₹{order.total.toFixed(0)}</div>
                    <div className="text-xs text-on-surface-variant">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                    </div>
                  </div>

                  <span className={`material-symbols-outlined text-outline transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-outline-variant/20 p-5 bg-surface-container-low/30 space-y-5">
                    {/* Status Updater */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Update Status:</span>
                      {ORDER_STATUSES.map(s => {
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <button
                            key={s}
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: s })}
                            disabled={order.order_status === s || updateStatusMutation.isPending}
                            className={`flex items-center gap-1 text-[11px] font-bold border rounded-full px-2.5 py-1 transition-all disabled:opacity-50 ${
                              order.order_status === s
                                ? cfg.color + ' ring-2 ring-offset-1 ring-current'
                                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:border-primary/40 hover:text-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">{cfg?.icon}</span>
                            <span className="capitalize">{s}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Items + Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=40'}
                                alt={item.title}
                                className="w-8 h-8 rounded-lg object-cover border border-outline-variant/30"
                              />
                              <span className="text-xs text-on-surface flex-1 truncate">{item.title} ×{item.qty}</span>
                              <span className="text-xs font-bold text-on-surface">₹{(item.price * item.qty).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Delivery Address</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {order.address.line1}, {order.address.city}, {order.address.state} – {order.address.pincode}
                        </p>
                        <div className="mt-3 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Subtotal</span>
                            <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">GST</span>
                            <span className="font-medium">₹{order.gst.toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-secondary font-semibold">
                              <span>Discount</span>
                              <span>−₹{order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold border-t border-outline-variant/20 pt-1">
                            <span>Total</span>
                            <span className="text-primary">₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
