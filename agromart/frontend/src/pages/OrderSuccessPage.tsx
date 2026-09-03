import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!order && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/account/orders', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  const statusColor = {
    paid: 'text-secondary',
    pending_cod: 'text-amber-600',
    pending: 'text-outline',
    failed: 'text-error',
  }[order.payment_status] || 'text-outline';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Success Animation Ring */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-secondary-container flex items-center justify-center animate-bounce shadow-xl">
          <span className="material-symbols-outlined text-6xl text-secondary fill-1">check_circle</span>
        </div>
        <div className="absolute inset-0 rounded-full bg-secondary/10 animate-ping" />
      </div>

      {/* Heading */}
      <div className="text-center max-w-md space-y-3 mb-10">
        <h1 className="font-poppins font-bold text-4xl text-on-surface">
          {order.payment_method === 'cod' ? 'Order Placed!' : 'Payment Successful!'}
        </h1>
        <p className="text-on-surface-variant text-base leading-relaxed">
          {order.payment_method === 'cod'
            ? 'Your order has been placed. Our farmer partners will pack it fresh for you!'
            : 'Your payment was verified and order is confirmed. Thank you for supporting local farmers!'}
        </p>
        <div className="inline-flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2 border border-outline-variant/40">
          <span className="material-symbols-outlined text-secondary text-base">receipt_long</span>
          <span className="font-bold text-on-surface text-sm">Order #{order.order_number}</span>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant/40 rounded-3xl card-elevation-1 p-6 space-y-5 mb-8">
        {/* Items */}
        <div className="space-y-3">
          <h3 className="font-poppins font-semibold text-on-surface text-sm uppercase tracking-wide text-on-surface-variant">
            Items Ordered
          </h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=80'}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface line-clamp-1">{item.title}</p>
                <p className="text-xs text-on-surface-variant">{item.qty} × {item.unit} · ₹{item.price}</p>
              </div>
              <span className="text-sm font-bold text-on-surface">₹{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="border-t border-outline-variant/30 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>GST</span>
            <span>₹{order.gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Delivery</span>
            <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee.toFixed(2)}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-secondary font-semibold">
              <span>Discount</span>
              <span>−₹{order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-2 border-t border-outline-variant/20">
            <span className="text-on-surface">Total Paid</span>
            <span className="text-primary text-lg">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-base">location_on</span>
            <span className="text-xs font-semibold text-on-surface uppercase tracking-wide">Delivering To</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''},{' '}
            {order.address.city}, {order.address.state} – {order.address.pincode}
          </p>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">payments</span>
            <span className="text-xs font-semibold text-on-surface uppercase tracking-wide">Payment</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-on-surface capitalize">
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
            </div>
            <div className={`text-xs font-semibold capitalize ${statusColor}`}>
              {order.payment_status.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <Link
          to="/account/orders"
          className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">local_shipping</span>
          Track My Orders
        </Link>
        <Link
          to="/home"
          className="flex-1 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-bold py-3.5 rounded-2xl border border-outline-variant/40 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">storefront</span>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
