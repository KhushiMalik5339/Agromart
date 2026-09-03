import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuthStore } from '../store/authStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { label: 'Platform Metrics', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'All Orders', path: '/admin/orders', icon: 'receipt_long' },
    { label: 'Users & Farmers', path: '/admin/users', icon: 'group' },
    { label: 'Product Moderation', path: '/admin/products', icon: 'category' },
    { label: 'Coupons & Offers', path: '/admin/coupons', icon: 'local_offer' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 h-fit">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-outline-variant/30">
              <img
                src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                alt={user?.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-tertiary"
              />
              <div>
                <h3 className="font-poppins font-bold text-on-surface text-base">{user?.name}</h3>
                <span className="text-xs font-semibold text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  System Admin
                </span>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-tertiary text-on-tertiary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
