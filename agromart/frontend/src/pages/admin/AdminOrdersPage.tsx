import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Order } from '../../types';
import { DataService } from '../../services/dataService';

const ORDER_STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  placed: { label: 'Pending (Placed)', color: 'bg-blue-50 text-blue-700 border-blue-300', icon: 'receipt_long' },
  packed: { label: 'Processing (Packed)', color: 'bg-amber-50 text-amber-700 border-amber-300', icon: 'inventory_2' },
  shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-300', icon: 'local_shipping' },
  delivered: { label: 'Delivered', color: 'bg-green-50 text-green-700 border-green-300', icon: 'check_circle' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-300', icon: 'cancel' },
};

const PAYMENT_CONFIG: Record<string, string> = {
  paid: 'text-secondary font-bold',
  pending: 'text-outline',
  pending_cod: 'text-amber-600 font-bold',
  failed: 'text-error font-bold',
};

export const AdminOrdersPage: React.FC = () => {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: any }) => {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { order_status: status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      if (selectedOrder) {
        setSelectedOrder((prev) => (prev ? { ...prev, order_status: prev.order_status } : null));
      }
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return DataService.updateOrderStatus(orderId, 'cancelled');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const filteredOrders = (orders || []).filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.order_status === filterStatus;
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.address && o.address.city.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">Order Processing & Fulfillment</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track and advance orders across farm-to-table delivery stages, inspect line items & handle cancellations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1.5 rounded-full">
            {orders?.length || 0} Total Orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-white text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Orders
          </button>
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-white text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order # or item..."
            className="w-full bg-white border border-outline-variant/50 rounded-xl pl-9 pr-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-base text-outline">search</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">receipt_long</span>
            <p>No orders match this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Order</th>
                  <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Items</th>
                  <th className="text-left px-5 py-3 font-semibold">Destination</th>
                  <th className="text-left px-5 py-3 font-semibold">Status Stage</th>
                  <th className="text-right px-5 py-3 font-semibold">Total</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.placed;
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-on-surface">#{order.order_number}</div>
                        <div className="text-[11px] text-on-surface-variant">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-xs text-on-surface-variant">
                        <div className="line-clamp-2 max-w-xs">
                          {order.items.map((i) => `${i.title} (${i.qty})`).join(', ')}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant">
                        <div className="font-medium text-on-surface">{order.address?.city || 'Pune'}, {order.address?.state || 'Maharashtra'}</div>
                        <div className="text-[10px] text-outline capitalize">{order.payment_method.toUpperCase()} · {order.payment_status}</div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            updateStatusMutation.mutate({
                              orderId: order.id,
                              status: e.target.value as any,
                            })
                          }
                          className={`text-xs font-bold border rounded-lg px-2.5 py-1.5 focus:outline-none ${statusInfo.color}`}
                        >
                          <option value="placed">Pending (Placed)</option>
                          <option value="packed">Processing (Packed)</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-primary">
                        ₹{order.total.toFixed(0)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="View Full Details"
                            className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          {order.order_status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Cancel order #${order.order_number}?`)) {
                                  cancelOrderMutation.mutate(order.id);
                                }
                              }}
                              title="Cancel Order"
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-outline hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">cancel</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto card-elevation-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div>
                <h3 className="font-poppins font-bold text-xl text-on-surface">Order #{selectedOrder.order_number}</h3>
                <p className="text-xs text-on-surface-variant">
                  Placed on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ''}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full hover:bg-surface-container-high text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Status Progression Bar */}
            <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">Fulfillment Progression</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                {[
                  { step: 'placed', label: '1. Placed' },
                  { step: 'packed', label: '2. Packed' },
                  { step: 'shipped', label: '3. Shipped' },
                  { step: 'delivered', label: '4. Delivered' },
                ].map((s, idx) => {
                  const currentIdx = ['placed', 'packed', 'shipped', 'delivered'].indexOf(selectedOrder.order_status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = selectedOrder.order_status === s.step;
                  return (
                    <button
                      key={s.step}
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: selectedOrder.id, status: s.step as any })
                      }
                      className={`p-2 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-primary text-on-primary border-primary shadow-sm'
                          : isDone
                          ? 'bg-primary-container/20 text-primary border-primary/30'
                          : 'bg-white text-outline border-outline-variant/40'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-poppins font-bold text-sm text-on-surface">Order Items</h4>
              <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-on-surface line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-on-surface-variant">Qty: {item.qty} {item.unit} · ₹{item.price} each</div>
                    </div>
                    <div className="text-xs font-bold text-primary">₹{(item.price * item.qty).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-surface-container-low p-4 rounded-2xl space-y-1">
                <span className="font-bold text-on-surface uppercase text-[10px] text-outline">Shipping Address</span>
                <p className="font-bold text-on-surface">{selectedOrder.address?.label || 'Home'}</p>
                <p className="text-on-surface-variant">{selectedOrder.address?.line1}</p>
                <p className="text-on-surface-variant">{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl space-y-2">
                <span className="font-bold text-on-surface uppercase text-[10px] text-outline">Payment Summary</span>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">{selectedOrder.delivery_fee === 0 ? 'FREE' : `₹${selectedOrder.delivery_fee}`}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Discount:</span>
                    <span className="font-semibold">-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-primary pt-2 border-t border-outline-variant/30 text-sm">
                  <span>Total Paid:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
