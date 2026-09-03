import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/axios';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['home-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Personalized Greeting Header */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Customer'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-primary shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full">
                {user?.role === 'farmer' ? 'Farmer Member' : 'Organic Member'}
              </span>
            </div>
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-on-surface mt-1">
              Welcome back, {user?.name || 'Organic Foodie'}! 🌱
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Here are today's fresh harvests picked specifically for your preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/wishlist"
            className="bg-white hover:bg-surface-container-high text-on-surface border border-outline-variant/60 font-semibold px-4 py-2.5 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base text-tertiary">favorite</span>
            Saved Wishlist
          </Link>
          <Link
            to="/account/orders"
            className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-4 py-2.5 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            My Orders
          </Link>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-poppins font-bold text-xl sm:text-2xl text-on-surface">Recommended For You</h2>
            <p className="text-xs text-on-surface-variant">Based on your recent organic produce searches.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-surface-container-low rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products?.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Fresh Harvest Highlight Banner */}
      <section className="bg-gradient-to-r from-primary to-secondary text-on-primary rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            Kashmir Harvest Season
          </span>
          <h2 className="font-poppins font-bold text-3xl">Mongra Grade Kashmiri Saffron Arrived!</h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Harvested yesterday in Pampore fields. Certified 100% pure threads with full farm traceability.
          </p>
          <Link
            to="/product/pure-kashmiri-organic-saffron"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-on-surface font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm mt-2"
          >
            Buy Fresh Saffron (Kesar)
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Seasonal All Products */}
      <section className="space-y-6">
        <h2 className="font-poppins font-bold text-xl sm:text-2xl text-on-surface">Seasonal Organic Harvest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  );
};
