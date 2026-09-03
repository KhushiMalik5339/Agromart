import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [sort, setSort] = useState('popular');
  const [isOrganic, setIsOrganic] = useState<boolean | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['category-products', slug, sort, isOrganic, maxPrice],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (slug) params.append('category', slug);
      if (sort) params.append('sort', sort);
      if (isOrganic !== undefined) params.append('is_organic', String(isOrganic));
      if (maxPrice < 1000) params.append('max_price', String(maxPrice));

      const res = await api.get(`/products?${params.toString()}`);
      return res.data;
    },
  });

  const activeCategoryName = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')
    : 'All Produce';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Category Header Banner */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-sm">nature</span>
            Organic Catalog
          </div>
          <h1 className="font-poppins font-bold text-3xl text-on-surface capitalize">
            {activeCategoryName}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Fresh, chemical-free harvests direct from local farm fields.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase">Sort By:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="popular">Popularity</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Harvest</option>
          </select>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <Link
          to="/category/vegetables"
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            slug === 'vegetables'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🥬 Vegetables
        </Link>
        <Link
          to="/category/fruits"
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            slug === 'fruits'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🍎 Organic Fruits
        </Link>
        <Link
          to="/category/spices"
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            slug === 'spices'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🌸 Spices & Saffron
        </Link>
        <Link
          to="/category/seeds-grains"
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            slug === 'seeds-grains'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🌾 Seeds & Grains
        </Link>
      </div>

      {/* Main Grid + Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 h-fit space-y-6">
          <h3 className="font-poppins font-bold text-lg text-on-surface pb-3 border-b border-outline-variant/30 flex items-center justify-between">
            <span>Filter Harvest</span>
            <span className="material-symbols-outlined text-outline">tune</span>
          </h3>

          {/* Organic Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Purity Certification
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="organic-check"
                checked={isOrganic === true}
                onChange={(e) => setIsOrganic(e.target.checked ? true : undefined)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="organic-check" className="text-sm text-on-surface font-medium cursor-pointer">
                100% Certified Organic Only
              </label>
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-primary font-bold text-sm">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setIsOrganic(undefined);
              setMaxPrice(1000);
              setSort('popular');
            }}
            className="w-full text-xs font-bold text-outline hover:text-error transition-colors py-2 text-center"
          >
            Reset All Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-surface-container-low rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="bg-surface-container-low text-center py-16 rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-2">eco</span>
              <h3 className="font-poppins font-bold text-lg text-on-surface">No products found</h3>
              <p className="text-xs text-on-surface-variant mt-1">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
