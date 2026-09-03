import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Cart } from '../types';
import { QuantityPicker } from '../components/QuantityPicker';
import { useCartStore } from '../store/cartStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { setCart } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [checkoutAmounts, setCheckoutAmounts] = useState<{
    subtotal: number; gst: number; delivery_fee: number; discount: number; total: number;
  } | null>(null);

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart');
      return res.data;
    },
    retry: false,
  });

  const updateQtyMutation = useMutation({
    mutationFn: async ({ productId, qty }: { productId: string; qty: number }) => {
      const res = await api.put('/cart/items', { product_id: productId, qty });
      return res.data;
    },
    onSuccess: (data) => {
      setCart(data);
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete(`/cart/items/${productId}`);
      return res.data;
    },
    onSuccess: (data) => {
      setCart(data);
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/cart');
      return res.data;
    },
    onSuccess: (data) => {
      setCart(data);
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/checkout/calculate', { coupon_code: couponInput.trim() });
      return res.data;
    },
    onSuccess: (data) => {
      setCoupon(couponInput.trim());
      setCheckoutAmounts(data);
      setCouponError('');
    },
    onError: () => {
      setCouponError('Invalid or expired coupon code.');
    },
  });

  const recalcMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/checkout/calculate', { coupon_code: coupon || null });
      return res.data;
    },
    onSuccess: setCheckoutAmounts,
  });

  const calcAmounts = async () => {
    try {
      const res = await api.post('/checkout/calculate', { coupon_code: coupon || null });
      setCheckoutAmounts(res.data);
    } catch {
      // not logged in — compute locally
    }
  };

  React.useEffect(() => {
    if (cart?.items?.length) calcAmounts();
  }, [cart]);

  const subtotal = checkoutAmounts?.subtotal ?? (cart?.subtotal || 0);
  const gst = checkoutAmounts?.gst ?? subtotal * 0.05;
  const delivery = checkoutAmounts?.delivery_fee ?? (subtotal > 499 ? 0 : 49);
  const discount = checkoutAmounts?.discount ?? 0;
  const total = checkoutAmounts?.total ?? (subtotal + gst + delivery - discount);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-surface-container-low rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-28 h-28 rounded-full bg-surface-container-low flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-outline">shopping_basket</span>
        </div>
        <div>
          <h1 className="font-poppins font-bold text-3xl text-on-surface">Your Cart is Empty</h1>
          <p className="text-on-surface-variant mt-2">Start shopping for fresh organic produce!</p>
        </div>
        <Link
          to="/category/vegetables"
          className="bg-primary text-on-primary font-bold px-8 py-3 rounded-2xl hover:bg-primary-container transition-all shadow-md"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-poppins font-bold text-3xl text-on-surface">
          Shopping Cart
          <span className="ml-3 text-sm font-normal text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
            {cart.item_count} item{cart.item_count !== 1 ? 's' : ''}
          </span>
        </h1>
        <button
          onClick={() => clearCartMutation.mutate()}
          className="text-sm text-error hover:underline font-medium flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">delete_sweep</span>
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product_id}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 flex gap-5 card-elevation-1 hover:card-elevation-2 transition-all"
            >
              <Link to={`/product/${item.product?.slug || item.product_id}`}>
                <img
                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200'}
                  alt={item.product?.title}
                  className="w-24 h-24 rounded-xl object-cover border border-outline-variant/30 hover:scale-105 transition-transform"
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.product?.slug || item.product_id}`}>
                    <h3 className="font-poppins font-semibold text-on-surface text-base hover:text-primary transition-colors line-clamp-1">
                      {item.product?.title || 'Product'}
                    </h3>
                  </Link>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {item.product?.farm_name || 'Organic Farm'} · {item.product?.unit || 'unit'}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <QuantityPicker
                    value={item.qty}
                    min={1}
                    max={item.product?.stock_qty || 10}
                    onChange={(qty) => updateQtyMutation.mutate({ productId: item.product_id, qty })}
                  />
                  <div className="text-right">
                    <div className="font-bold text-on-surface">
                      ₹{(item.price_snapshot * item.qty).toFixed(2)}
                    </div>
                    <div className="text-xs text-on-surface-variant">₹{item.price_snapshot}/{item.product?.unit || 'unit'}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItemMutation.mutate(item.product_id)}
                className="p-1.5 text-outline hover:text-error transition-colors self-start rounded-full hover:bg-error-container/20"
                aria-label="Remove item"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 card-elevation-1">
            <h3 className="font-poppins font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">local_offer</span>
              Apply Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={() => applyCouponMutation.mutate()}
                disabled={!couponInput.trim()}
                className="bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-50 hover:bg-primary-container transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{couponError}</p>}
            {coupon && !couponError && (
              <p className="text-secondary text-xs mt-2 flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Coupon "{coupon}" applied!
              </p>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 card-elevation-1 space-y-3">
            <h3 className="font-poppins font-semibold text-on-surface">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({cart.item_count} items)</span>
                <span className="font-medium text-on-surface">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>GST (5%)</span>
                <span className="font-medium text-on-surface">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span className={`font-medium ${delivery === 0 ? 'text-secondary' : 'text-on-surface'}`}>
                  {delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>Coupon Discount</span>
                  <span>−₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-outline-variant/30 pt-3 flex justify-between items-center font-bold text-base">
                <span className="text-on-surface">Total</span>
                <span className="text-primary text-xl">₹{total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal <= 499 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                Add ₹{(499 - subtotal).toFixed(0)} more for FREE delivery!
              </div>
            )}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">lock</span>
              Proceed to Checkout
            </button>
            <Link
              to="/category/vegetables"
              className="block text-center text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
