import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface WishlistItem {
  product_id: string;
  product?: Product;
}

export const WishlistPage: React.FC = () => {
  const qc = useQueryClient();

  const { data: wishlistItems, isLoading } = useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-8 w-48 bg-surface-container-low rounded-xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-80 bg-surface-container-low rounded-xl" />)}
        </div>
      </div>
    );
  }

  const products = wishlistItems?.map(w => w.product).filter(Boolean) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-poppins font-bold text-3xl text-on-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary text-3xl fill-1">favorite</span>
          My Wishlist
          <span className="text-sm font-normal text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
            {products?.length || 0} items
          </span>
        </h1>
      </div>

      {!products?.length ? (
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="w-28 h-28 rounded-full bg-tertiary-container/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-tertiary opacity-60">favorite</span>
          </div>
          <div>
            <h2 className="font-poppins font-bold text-2xl text-on-surface">Your Wishlist is Empty</h2>
            <p className="text-on-surface-variant mt-2">Save products you love for later!</p>
          </div>
          <Link
            to="/home"
            className="bg-primary text-on-primary font-bold px-8 py-3 rounded-2xl hover:bg-primary-container transition-all shadow-md"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems?.map((item) => (
            item.product ? (
              <div key={item.product_id} className="relative group">
                <ProductCard product={item.product} />
                {/* Remove from wishlist overlay button */}
                <button
                  onClick={() => removeMutation.mutate(item.product_id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-tertiary hover:bg-error hover:text-on-error transition-all opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Remove from wishlist"
                >
                  <span className="material-symbols-outlined text-base fill-1">close</span>
                </button>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};
