import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Order } from '../types';

const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  placed:    { color: 'bg-blue-50 text-blue-700 border-blue-200',    icon: 'receipt_long',    label: 'Order Placed' },
  packed:    { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'inventory_2',     label: 'Packed' },
  shipped:   { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'local_shipping', label: 'Shipped' },
  delivered: { color: 'bg-green-50 text-green-700 border-green-200', icon: 'check_circle',    label: 'Delivered' },
  cancelled: { color: 'bg-red-50 text-red-700 border-red-200',       icon: 'cancel',           label: 'Cancelled' },
};

const PAYMENT_CONFIG: Record<string, { color: string; label: string }> = {
  paid:        { color: 'text-secondary font-bold', label: 'Paid' },
  pending:     { color: 'text-outline',             label: 'Pending' },
  pending_cod: { color: 'text-amber-600 font-bold', label: 'COD' },
  failed:      { color: 'text-error font-bold',     label: 'Failed' },
};

export const OrdersPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-surface-container-low rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-28 h-28 rounded-full bg-surface-container-low flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-outline">receipt_long</span>
        </div>
        <div>
          <h1 className="font-poppins font-bold text-3xl text-on-surface">No Orders Yet</h1>
          <p className="text-on-surface-variant mt-2">Start shopping and your orders will appear here!</p>
        </div>
        <Link
          to="/home"
          className="bg-primary text-on-primary font-bold px-8 py-3 rounded-2xl hover:bg-primary-container transition-all shadow-md"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-poppins font-bold text-3xl text-on-surface">My Orders</h1>
        <span className="text-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusCfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.placed;
          const paymentCfg = PAYMENT_CONFIG[order.payment_status] || PAYMENT_CONFIG.pending;
          const isExpanded = expandedId === order.id;

          return (
            <div
              key={order.id}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden"
            >
              {/* Order header row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full text-left p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors"
              >
                {/* Status badge */}
                <div className={`hidden sm:flex flex-shrink-0 items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-bold ${statusCfg.color}`}>
                  <span className="material-symbols-outlined text-sm">{statusCfg.icon}</span>
                  {statusCfg.label}
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-poppins font-bold text-on-surface">#{order.order_number}</span>
                    <span className={`sm:hidden text-xs border rounded-full px-2 py-0.5 font-bold ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <span className={`text-xs ${paymentCfg.color}`}>• {paymentCfg.label}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-primary text-lg">₹{order.total.toFixed(2)}</div>
                  <div className="text-xs text-on-surface-variant capitalize">{order.payment_method}</div>
                </div>

                {/* Expand icon */}
                <span className={`material-symbols-outlined text-outline transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-outline-variant/20 p-5 bg-surface-container-low/40 space-y-5">
                  {/* Items */}
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=80'}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                            <p className="text-xs text-on-surface-variant">Qty: {item.qty} {item.unit} · ₹{item.price}/{item.unit}</p>
                          </div>
                          <span className="text-sm font-bold text-on-surface">₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery + Pricing row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-primary text-base">location_on</span>
                        <span className="text-xs font-semibold text-on-surface">Delivery Address</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''},{' '}
                        {order.address.city}, {order.address.state} – {order.address.pincode}
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 space-y-1 text-xs">
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Subtotal</span><span className="font-medium text-on-surface">₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>GST</span><span className="font-medium text-on-surface">₹{order.gst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Delivery</span>
                        <span className={order.delivery_fee === 0 ? 'text-secondary font-semibold' : 'font-medium text-on-surface'}>
                          {order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee.toFixed(2)}`}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-secondary font-semibold">
                          <span>Discount</span><span>−₹{order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-outline-variant/20 pt-1 flex justify-between font-bold text-sm">
                        <span className="text-on-surface">Total</span>
                        <span className="text-primary">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
