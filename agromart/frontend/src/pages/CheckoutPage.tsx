import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Cart, Address, Order } from '../types';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface CheckoutAmounts {
  subtotal: number;
  gst: number;
  delivery_fee: number;
  discount: number;
  total: number;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [amounts, setAmounts] = useState<CheckoutAmounts | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: 'Home', line1: '', city: '', state: '', pincode: '',
  });

  const { data: cart } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart');
      return res.data;
    },
  });

  const { data: addresses, refetch: refetchAddresses } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/auth/addresses');
      return res.data;
    },
  });

  useEffect(() => {
    if (addresses?.length && !selectedAddressId) {
      const def = addresses.find(a => a.is_default) || addresses[0];
      if (def.id) setSelectedAddressId(def.id);
    }
  }, [addresses]);

  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        const res = await api.post('/checkout/calculate', { coupon_code: couponCode || null });
        setAmounts(res.data);
      } catch {
        // silent
      }
    };
    if (cart?.items?.length) fetchAmounts();
  }, [cart, couponCode]);

  const addAddressMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/addresses', newAddress);
      return res.data;
    },
    onSuccess: async (data) => {
      setSelectedAddressId(data.id || data._id);
      setShowAddAddress(false);
      refetchAddresses();
    },
  });

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address.');
      return;
    }
    setIsPlacingOrder(true);
    try {
      const orderRes = await api.post('/checkout/create-order', {
        address_id: selectedAddressId,
        payment_method: paymentMethod,
        coupon_code: couponCode || null,
      });
      const order: Order = orderRes.data;

      if (paymentMethod === 'cod') {
        navigate('/order-success', { state: { order } });
        return;
      }

      // Razorpay flow
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: Math.round((amounts?.total || order.total) * 100),
        currency: 'INR',
        name: 'AgroMart',
        description: `Order #${order.order_number}`,
        order_id: order.razorpay_order_id,
        theme: { color: '#0d631b' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await api.post('/checkout/verify-payment', {
              order_id: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/order-success', { state: { order: verifyRes.data } });
          } catch {
            navigate('/account/orders');
          }
        },
        modal: { ondismiss: () => setIsPlacingOrder(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setIsPlacingOrder(false);
    }
  };

  const subtotal = amounts?.subtotal ?? (cart?.subtotal || 0);
  const gst = amounts?.gst ?? subtotal * 0.05;
  const delivery = amounts?.delivery_fee ?? (subtotal > 499 ? 0 : 49);
  const discount = amounts?.discount ?? 0;
  const total = amounts?.total ?? (subtotal + gst + delivery - discount);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-poppins font-bold text-3xl text-on-surface mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-6">

          {/* Delivery Address */}
          <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1">
            <h2 className="font-poppins font-semibold text-on-surface text-lg mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              Delivery Address
            </h2>

            {addresses && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/40 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id!)}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-on-surface text-sm">{addr.label}</span>
                        {addr.is_default && (
                          <span className="text-[10px] text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full font-bold">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm">No saved addresses. Add one below.</p>
            )}

            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              {showAddAddress ? 'Cancel' : 'Add New Address'}
            </button>

            {showAddAddress && (
              <div className="mt-4 bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 space-y-3">
                {(['label', 'line1', 'line2', 'city', 'state', 'pincode'] as const).map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field === 'line1' ? 'Address Line 1 *' : field === 'line2' ? 'Address Line 2 (optional)' : field.charAt(0).toUpperCase() + field.slice(1) + ' *'}
                    value={(newAddress as Record<string, string>)[field] || ''}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ))}
                <button
                  onClick={() => addAddressMutation.mutate()}
                  disabled={!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode}
                  className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-primary-container transition-colors"
                >
                  {addAddressMutation.isPending ? 'Saving…' : 'Save Address'}
                </button>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1">
            <h2 className="font-poppins font-semibold text-on-surface text-lg mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">payments</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-primary"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#072654] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    Rzp
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface text-sm">Razorpay</div>
                    <div className="text-xs text-on-surface-variant">UPI, Cards, Netbanking, Wallets</div>
                  </div>
                  <span className="ml-auto text-[10px] text-secondary bg-secondary-container/50 px-2 py-1 rounded-full font-bold">Recommended</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-primary"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-700 text-xl">payments</span>
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface text-sm">Cash on Delivery</div>
                    <div className="text-xs text-on-surface-variant">Pay when your order arrives</div>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1 space-y-4">
            <h3 className="font-poppins font-semibold text-on-surface text-lg">Order Summary</h3>

            {/* Cart items mini list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart?.items?.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3">
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=80'}
                    alt={item.product?.title}
                    className="w-12 h-12 rounded-lg object-cover border border-outline-variant/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-on-surface line-clamp-1">{item.product?.title || 'Product'}</p>
                    <p className="text-xs text-on-surface-variant">Qty: {item.qty}</p>
                  </div>
                  <span className="text-xs font-bold text-on-surface">₹{(item.price_snapshot * item.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/30 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>GST (5%)</span>
                <span className="text-on-surface font-medium">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span className={`font-medium ${delivery === 0 ? 'text-secondary' : 'text-on-surface'}`}>
                  {delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>Discount</span>
                  <span>−₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-outline-variant/30 pt-2 flex justify-between font-bold text-base">
                <span className="text-on-surface">Total</span>
                <span className="text-primary text-xl">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddressId}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-base"
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">
                    {paymentMethod === 'razorpay' ? 'credit_card' : 'local_shipping'}
                  </span>
                  {paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place COD Order'} · ₹{total.toFixed(2)}
                </>
              )}
            </button>

            <p className="text-center text-xs text-on-surface-variant flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm text-secondary">lock</span>
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
