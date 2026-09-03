import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Order, Product } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface FarmerStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  avg_rating: number;
}

export const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: stats } = useQuery<FarmerStats>({
    queryKey: ['farmer-stats'],
    queryFn: async () => {
      const res = await api.get('/farmer/stats');
      return res.data;
    },
  });

  const { data: recentOrders } = useQuery<Order[]>({
    queryKey: ['farmer-orders'],
    queryFn: async () => {
      const res = await api.get('/farmer/orders?limit=5');
      return res.data;
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['farmer-products'],
    queryFn: async () => {
      const res = await api.get('/farmer/products');
      return res.data;
    },
  });

  const lowStockProducts = products?.filter(p => p.stock_qty > 0 && p.stock_qty < 10) || [];
  const outOfStock = products?.filter(p => p.stock_qty === 0) || [];

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
      icon: 'currency_rupee',
      color: 'bg-secondary-container text-on-secondary-container',
      iconColor: 'text-secondary',
    },
    {
      label: 'Orders Fulfilled',
      value: stats?.total_orders?.toString() || '0',
      icon: 'local_shipping',
      color: 'bg-blue-50 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Listings',
      value: stats?.total_products?.toString() || products?.length?.toString() || '0',
      icon: 'inventory_2',
      color: 'bg-amber-50 text-amber-800',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Avg. Rating',
      value: stats?.avg_rating ? `${stats.avg_rating.toFixed(1)} ★` : '—',
      icon: 'star',
      color: 'bg-tertiary-container/30 text-on-tertiary-container',
      iconColor: 'text-tertiary',
    },
  ];

  const ORDER_STATUS_COLORS: Record<string, string> = {
    placed: 'bg-blue-50 text-blue-700 border-blue-200',
    packed: 'bg-amber-50 text-amber-700 border-amber-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-on-primary shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-on-primary/80 text-sm font-medium">Welcome back,</p>
            <h1 className="font-poppins font-bold text-2xl">{user?.name} 🌾</h1>
            <p className="text-on-primary/70 text-sm mt-1">Here's your farm performance overview</p>
          </div>
          <div className="hidden sm:block">
            <Link
              to="/farmer/add-product"
              className="bg-white/20 hover:bg-white/30 text-on-primary font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 backdrop-blur-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-5 border border-outline-variant/20 ${card.color} card-elevation-1`}>
            <span className={`material-symbols-outlined text-2xl ${card.iconColor}`}>{card.icon}</span>
            <div className="mt-3">
              <div className="font-poppins font-bold text-2xl">{card.value}</div>
              <div className="text-xs font-medium opacity-70 mt-0.5">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Row */}
      {(lowStockProducts.length > 0 || outOfStock.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outOfStock.length > 0 && (
            <div className="bg-error-container/30 border border-error/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-error font-semibold text-sm mb-2">
                <span className="material-symbols-outlined text-base">error</span>
                {outOfStock.length} Product{outOfStock.length !== 1 ? 's' : ''} Out of Stock
              </div>
              <ul className="space-y-1">
                {outOfStock.slice(0, 3).map(p => (
                  <li key={p.id} className="text-xs text-on-surface-variant truncate">• {p.title}</li>
                ))}
              </ul>
              <Link to="/farmer/inventory" className="mt-2 block text-xs text-primary font-semibold hover:underline">Manage Inventory →</Link>
            </div>
          )}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm mb-2">
                <span className="material-symbols-outlined text-base">warning</span>
                {lowStockProducts.length} Product{lowStockProducts.length !== 1 ? 's' : ''} Low Stock
              </div>
              <ul className="space-y-1">
                {lowStockProducts.slice(0, 3).map(p => (
                  <li key={p.id} className="text-xs text-on-surface-variant truncate">• {p.title} ({p.stock_qty} {p.unit} left)</li>
                ))}
              </ul>
              <Link to="/farmer/inventory" className="mt-2 block text-xs text-amber-700 font-semibold hover:underline">Update Stock →</Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <h2 className="font-poppins font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
            Recent Customer Orders
          </h2>
          <Link to="/farmer/orders" className="text-primary text-xs font-semibold hover:underline">View all</Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="divide-y divide-outline-variant/20">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-on-surface text-sm">#{order.order_number}</p>
                  <p className="text-xs text-on-surface-variant line-clamp-1">
                    {order.items.map(i => i.title).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[11px] border rounded-full px-2.5 py-0.5 font-semibold capitalize ${ORDER_STATUS_COLORS[order.order_status] || ''}`}>
                    {order.order_status}
                  </span>
                  <span className="font-bold text-primary text-sm">₹{order.total.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">receipt_long</span>
            <p className="text-sm">No orders yet. Keep growing!</p>
          </div>
        )}
      </div>
    </div>
  );
};
