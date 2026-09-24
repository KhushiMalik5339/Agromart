import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { api } from '../lib/axios';
import { Order, Address, Product } from '../types';
import { DataService } from '../services/dataService';

export const CustomerDashboardPage: React.FC = () => {
  const { user, setUser, logout } = useAuthStore();
  const { cart, updateQuantity, removeItem } = useCartStore();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'profile';
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Profile state
  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98112 34567');
  const [profileSaved, setProfileSaved] = useState(false);

  // Address state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('Pune');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrPincode, setAddrPincode] = useState('411001');

  // Track Order state
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Queries
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data || [];
    },
  });

  const { data: addresses } = useQuery<Address[]>({
    queryKey: ['customer-addresses'],
    queryFn: async () => {
      const res = await api.get('/auth/addresses');
      return res.data || [];
    },
  });

  const { data: wishlist } = useQuery<Product[]>({
    queryKey: ['customer-wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data || [];
    },
  });

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const updated = { ...user!, name, phone };
      setUser(updated);
      return updated;
    },
    onSuccess: () => {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/addresses', {
        label: addrLabel,
        line1: addrLine,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        is_default: (addresses?.length || 0) === 0,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] });
      setShowAddAddress(false);
      setAddrLine('');
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/auth/addresses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (prodId: string) => {
      const res = await api.post(`/wishlist/${prodId}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-wishlist'] });
    },
  });

  // Determine active order to track
  const activeOrderToTrack =
    orders?.find((o) => o.id === trackingOrderId || o.order_number === trackingOrderId) ||
    orders?.[0];

  const TRACK_STAGES = [
    { key: 'placed', label: 'Order Placed', desc: 'Received & sent to organic farm' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Farm harvesting & quality check' },
    { key: 'packed', label: 'Packed & Processing', desc: 'Eco-packaged in temperature crate' },
    { key: 'shipped', label: 'Out for Delivery', desc: 'In transit with cold-chain courier' },
    { key: 'delivered', label: 'Delivered', desc: 'Farm-fresh harvest handed to you' },
  ];

  const getStageIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'placed') return 0;
    if (s === 'confirmed') return 1;
    if (s === 'packed') return 2;
    if (s === 'shipped') return 3;
    if (s === 'delivered') return 4;
    return 0;
  };

  const navTabs = [
    { id: 'profile', label: 'My Profile', icon: 'person' },
    { id: 'orders', label: 'My Orders', icon: 'receipt_long' },
    { id: 'track', label: 'Track Order', icon: 'local_shipping' },
    { id: 'wishlist', label: 'My Wishlist', icon: 'favorite' },
    { id: 'cart', label: 'My Cart', icon: 'shopping_basket' },
    { id: 'addresses', label: 'Saved Addresses', icon: 'home_pin' },
    { id: 'settings', label: 'Account Settings', icon: 'settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Customer Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/40 card-elevation-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Customer'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-primary shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-poppins font-bold text-2xl text-on-surface">{user?.name}</h1>
              <span className="text-[11px] font-bold bg-secondary-container/80 text-on-secondary-container px-2.5 py-0.5 rounded-full capitalize">
                Organic Foodie
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{user?.email} · {user?.phone || '+91 98112 34567'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/category/vegetables"
            className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            Shop Produce
          </Link>
          <button
            onClick={logout}
            className="p-2.5 hover:bg-rose-50 text-outline hover:text-error rounded-xl transition-colors border border-outline-variant/40 flex items-center justify-center"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 card-elevation-1 h-fit space-y-1.5">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                  {tab.label}
                </div>
                {tab.id === 'orders' && orders && orders.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-outline'}`}>
                    {orders.length}
                  </span>
                )}
                {tab.id === 'wishlist' && wishlist && wishlist.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-outline'}`}>
                    {wishlist.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Panel Content */}
        <div className="lg:col-span-3">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-6">
              <div>
                <h2 className="font-poppins font-bold text-xl text-on-surface">Personal Information</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Manage your personal profile and contact numbers.</p>
              </div>

              {profileSaved && (
                <div className="p-3.5 bg-green-100 text-green-800 rounded-xl text-xs font-semibold animate-fadeIn">
                  Your profile details have been updated!
                </div>
              )}

              <div className="space-y-4 text-xs max-w-lg">
                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || 'customer@agromart.com'}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface bg-gray-50"
                  />
                  <span className="text-[10px] text-outline mt-1 block">Email is bound to your AgroMart account.</span>
                </div>

                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => updateProfileMutation.mutate()}
                    className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
                <h2 className="font-poppins font-bold text-xl text-on-surface">Order History</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Track and view invoices for all your past farm harvests.</p>
              </div>

              {!orders || orders.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-outline-variant/40 text-on-surface-variant space-y-3">
                  <span className="material-symbols-outlined text-5xl opacity-40">receipt_long</span>
                  <p>No orders placed yet.</p>
                  <Link
                    to="/category/vegetables"
                    className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl inline-block"
                  >
                    Browse Fresh Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
                        <div>
                          <span className="font-bold text-sm text-on-surface">Order #{order.order_number}</span>
                          <span className="text-xs text-on-surface-variant ml-2">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold capitalize bg-primary-container/20 text-primary px-3 py-1 rounded-full">
                            Status: {order.order_status}
                          </span>
                          <span className="font-bold text-primary text-sm">₹{order.total}</span>
                        </div>
                      </div>

                      <div className="divide-y divide-outline-variant/20">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 text-xs">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <div>
                                <span className="font-bold text-on-surface">{item.title}</span>
                                <div className="text-outline">Qty: {item.qty} {item.unit}</div>
                              </div>
                            </div>
                            <span className="font-bold text-on-surface">₹{(item.price * item.qty).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-outline">
                          Delivery to: {order.address?.city}, {order.address?.state}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTrackingOrderId(order.id);
                              setActiveTab('track');
                            }}
                            className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            Live Track
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="border border-outline-variant/60 text-on-surface hover:border-primary text-xs font-bold px-3 py-1.5 rounded-lg"
                          >
                            Invoice Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACK ORDER */}
          {activeTab === 'track' && (
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-6">
              <div>
                <h2 className="font-poppins font-bold text-xl text-on-surface">Live Farm-to-Table Order Tracker</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Real-time harvest status, courier dispatch, and estimated delivery timeline.
                </p>
              </div>

              {/* Order Selector */}
              {orders && orders.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase text-outline">Select Order:</label>
                  <select
                    value={activeOrderToTrack?.id || ''}
                    onChange={(e) => setTrackingOrderId(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        #{o.order_number} ({o.order_status}) - ₹{o.total}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeOrderToTrack ? (
                <div className="space-y-8">
                  {/* Current Summary Card */}
                  <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-5 rounded-2xl border border-primary/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Tracking Order</span>
                      <h3 className="font-poppins font-bold text-xl text-on-surface">#{activeOrderToTrack.order_number}</h3>
                      <p className="text-xs text-on-surface-variant">Estimated Delivery: Within 24-48 Hours</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-primary text-on-primary px-3 py-1 rounded-full capitalize">
                        {activeOrderToTrack.order_status}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Visual Progress Stepper */}
                  <div className="space-y-4">
                    <div className="relative flex items-center justify-between">
                      {/* Connecting Line */}
                      <div className="absolute left-6 right-6 top-5 h-1 bg-surface-container-high -z-0">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width: `${(getStageIndex(activeOrderToTrack.order_status) / (TRACK_STAGES.length - 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {TRACK_STAGES.map((stage, idx) => {
                        const currentIdx = getStageIndex(activeOrderToTrack.order_status);
                        const isDone = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;
                        return (
                          <div key={stage.key} className="flex flex-col items-center text-center z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isCurrent
                                  ? 'bg-primary text-on-primary ring-4 ring-primary/20 scale-110 shadow-md'
                                  : isDone
                                  ? 'bg-primary text-on-primary'
                                  : 'bg-surface-container-high text-outline'
                              }`}
                            >
                              {isDone ? (
                                <span className="material-symbols-outlined text-base">check</span>
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span className="font-bold text-xs text-on-surface mt-2 max-w-[80px]">
                              {stage.label}
                            </span>
                            <span className="text-[10px] text-on-surface-variant hidden md:block max-w-[100px] mt-0.5">
                              {stage.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items in Transit */}
                  <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                    <h4 className="font-poppins font-bold text-sm text-on-surface">Items in This Shipment</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeOrderToTrack.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div>
                            <div className="font-bold text-xs text-on-surface">{item.title}</div>
                            <div className="text-[11px] text-on-surface-variant">Qty: {item.qty} {item.unit}</div>
                            <div className="text-xs font-bold text-primary">₹{(item.price * item.qty).toFixed(0)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No orders to track.</p>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
                <h2 className="font-poppins font-bold text-xl text-on-surface">My Wishlist</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Your saved organic produce items.</p>
              </div>

              {!wishlist || wishlist.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-outline-variant/40 text-on-surface-variant space-y-3">
                  <span className="material-symbols-outlined text-5xl opacity-40">favorite_border</span>
                  <p>Your wishlist is empty.</p>
                  <Link
                    to="/category/vegetables"
                    className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl inline-block"
                  >
                    Explore Organic Produce
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-3 flex flex-col justify-between"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low">
                        <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] text-secondary font-bold uppercase">{prod.farm_name}</div>
                        <h4 className="font-poppins font-bold text-sm text-on-surface line-clamp-1">{prod.title}</h4>
                        <div className="text-primary font-bold text-base mt-1">₹{prod.price} <span className="text-xs text-outline font-normal">/{prod.unit}</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => removeFromWishlistMutation.mutate(prod.id)}
                          className="text-xs font-semibold text-outline hover:text-error py-1.5 rounded-lg border border-outline-variant/50"
                        >
                          Remove
                        </button>
                        <Link
                          to={`/product/${prod.slug}`}
                          className="bg-primary hover:bg-primary-container text-on-primary text-center text-xs font-bold py-1.5 rounded-lg"
                        >
                          View Crop
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CART */}
          {activeTab === 'cart' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
                <h2 className="font-poppins font-bold text-xl text-on-surface">Your Shopping Basket</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Review items in your organic harvest crate.</p>
              </div>

              {!cart || cart.items.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-outline-variant/40 text-on-surface-variant space-y-3">
                  <span className="material-symbols-outlined text-5xl opacity-40">shopping_basket</span>
                  <p>Your cart is empty.</p>
                  <Link
                    to="/category/vegetables"
                    className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl inline-block"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
                  <div className="divide-y divide-outline-variant/20">
                    {cart.items.map((item) => (
                      <div key={item.product_id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product?.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200'}
                            alt={item.product?.title || 'Produce'}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-sm text-on-surface">{item.product?.title || 'Harvest Crop'}</div>
                            <div className="text-xs text-primary font-bold">₹{item.price_snapshot} /{item.product?.unit || 'kg'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-outline-variant/60 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product_id, Math.max(1, item.qty - 1))}
                              className="px-2.5 py-1 text-on-surface hover:bg-surface-container"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                              className="px-2.5 py-1 text-on-surface hover:bg-surface-container"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-primary text-sm min-w-[60px] text-right">
                            ₹{(item.price_snapshot * item.qty).toFixed(0)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="text-outline hover:text-error p-1"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-outline">Subtotal:</span>
                      <div className="font-poppins font-bold text-2xl text-primary">₹{cart.subtotal.toFixed(0)}</div>
                    </div>
                    <Link
                      to="/checkout"
                      className="bg-amber-500 hover:bg-amber-600 text-on-surface font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2"
                    >
                      <span>Proceed to Checkout</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 flex items-center justify-between">
                <div>
                  <h2 className="font-poppins font-bold text-xl text-on-surface">Delivery Addresses</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">Manage where your fresh organic harvests are delivered.</p>
                </div>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Address
                </button>
              </div>

              {showAddAddress && (
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-primary/40 space-y-4 card-elevation-1 animate-fadeIn">
                  <h3 className="font-poppins font-bold text-base text-on-surface">Add Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-on-surface uppercase mb-1">Address Label</label>
                      <input
                        type="text"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        placeholder="Home, Office, Farm"
                        className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-on-surface uppercase mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        placeholder="411001"
                        className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-on-surface uppercase mb-1">Street Address</label>
                      <input
                        type="text"
                        value={addrLine}
                        onChange={(e) => setAddrLine(e.target.value)}
                        placeholder="Flat / House No, Street name"
                        className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-on-surface uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-on-surface uppercase mb-1">State</label>
                      <input
                        type="text"
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 text-xs font-semibold text-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addAddressMutation.mutate()}
                      disabled={!addrLine || !addrPincode}
                      className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-base">home</span>
                        {addr.label}
                      </span>
                      {addr.is_default && (
                        <span className="text-[10px] font-bold text-secondary bg-secondary-container/60 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant">{addr.line1}</p>
                    <p className="text-xs text-on-surface-variant">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => addr.id && deleteAddressMutation.mutate(addr.id)}
                        className="text-xs font-semibold text-outline hover:text-error transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-6">
              <div>
                <h2 className="font-poppins font-bold text-xl text-on-surface">Account Preferences & Security</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Control notifications, password, and privacy settings.</p>
              </div>

              <div className="space-y-4 max-w-lg text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-on-surface uppercase block">Farm Notifications</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                    <span>Receive SMS when farm harvest dispatches</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                    <span>Email me seasonal organic harvest availability</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 space-y-3">
                  <span className="font-bold text-on-surface uppercase block">Security</span>
                  <div>
                    <label className="block text-outline uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
                    />
                  </div>
                  <button
                    onClick={() => alert('Password update link sent to your registered email.')}
                    className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Update Security
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto card-elevation-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <h3 className="font-poppins font-bold text-lg text-on-surface">Invoice #{selectedOrder.order_number}</h3>
                <p className="text-xs text-on-surface-variant">Payment Status: {selectedOrder.payment_status}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full hover:bg-surface-container-high text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-bold uppercase text-outline">Harvest Produce Breakdown</span>
              <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white">
                    <div>
                      <span className="font-bold text-on-surface">{item.title}</span>
                      <div className="text-[11px] text-on-surface-variant">Qty: {item.qty} {item.unit}</div>
                    </div>
                    <span className="font-bold text-primary">₹{(item.price * item.qty).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{selectedOrder.delivery_fee === 0 ? 'FREE' : `₹${selectedOrder.delivery_fee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-primary text-sm pt-2 border-t border-outline-variant/20">
                  <span>Total Paid:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2 rounded-xl"
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
