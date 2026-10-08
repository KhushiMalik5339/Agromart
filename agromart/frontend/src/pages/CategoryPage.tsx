import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

const ALL_CATEGORIES = [
  { name: 'All Produce', slug: '', emoji: '🧺' },
  { name: 'Fruits', slug: 'fruits', emoji: '🍎' },
  { name: 'Vegetables', slug: 'vegetables', emoji: '🥬' },
  { name: 'Grains & Cereals', slug: 'grains', emoji: '🌾' },
  { name: 'Pulses & Legumes', slug: 'pulses', emoji: '🫘' },
  { name: 'Dairy & Milk', slug: 'dairy', emoji: '🥛' },
  { name: 'Spices & Condiments', slug: 'spices', emoji: '🌶️' },
  { name: 'Oilseeds & Oils', slug: 'oilseeds-oils', emoji: '🌻' },
  { name: 'Dry Fruits & Nuts', slug: 'dry-fruits', emoji: '🥜' },
  { name: 'Seeds', slug: 'seeds', emoji: '🌱' },
  { name: 'Fertilizers & Manure', slug: 'fertilizers', emoji: '🧪' },
  { name: 'Tools & Equipment', slug: 'equipment', emoji: '🚜' },
  { name: 'Flowers & Plants', slug: 'plants', emoji: '🌸' },
  { name: 'Organic Products', slug: 'organic', emoji: '🌿' },
  { name: 'Other Agricultural', slug: 'other-agriculture', emoji: '🍯' },
];

const POPULAR_LOCATIONS = [
  { label: 'All Regions / All India', value: '' },
  { label: 'Haryana (Panipat / Karnal)', value: 'Haryana' },
  { label: 'Maharashtra (Nashik / Ratnagiri)', value: 'Maharashtra' },
  { label: 'Jammu & Kashmir (Pampore / Sopore)', value: 'Kashmir' },
  { label: 'Punjab (Ludhiana / Bathinda)', value: 'Punjab' },
  { label: 'Gujarat (Anand / Junagadh)', value: 'Gujarat' },
  { label: 'Rajasthan (Jodhpur / Kota)', value: 'Rajasthan' },
  { label: 'Kerala (Wayanad / Idukki)', value: 'Kerala' },
  { label: 'Himachal Pradesh (Shimla / Kullu)', value: 'Himachal' },
];

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const locationParam = searchParams.get('location') || '';

  const [sort, setSort] = useState('popular');
  const [isOrganic, setIsOrganic] = useState<boolean | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedLocation, setSelectedLocation] = useState<string>(locationParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(subcategoryParam);

  // Sync state if URL query params change
  useEffect(() => {
    if (subcategoryParam) setSelectedSubcategory(subcategoryParam);
    if (locationParam) setSelectedLocation(locationParam);
  }, [subcategoryParam, locationParam]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['category-products', slug, queryParam, selectedSubcategory, selectedLocation, sort, isOrganic, maxPrice],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (slug && slug !== 'all') params.append('category', slug);
      if (queryParam) params.append('q', queryParam);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (selectedLocation) params.append('location', selectedLocation);
      if (sort) params.append('sort', sort);
      if (isOrganic !== undefined) params.append('is_organic', String(isOrganic));
      if (maxPrice < 5000) params.append('max_price', String(maxPrice));

      const res = await api.get(`/products?${params.toString()}`);
      return res.data;
    },
  });

  // Extract available subcategories dynamically for current results or category
  const availableSubcategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const subs = new Set<string>();
    products.forEach((p) => {
      if (p.subcategory) subs.add(p.subcategory);
    });
    return Array.from(subs);
  }, [products]);

  const activeCategoryMeta = ALL_CATEGORIES.find((c) => c.slug === (slug || ''));
  const activeCategoryName = queryParam
    ? `Search: "${queryParam}"`
    : activeCategoryMeta?.name ||
      (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') : 'All Produce');

  const handleSubcategoryClick = (sub: string) => {
    if (selectedSubcategory === sub) {
      setSelectedSubcategory('');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('subcategory');
      setSearchParams(newParams);
    } else {
      setSelectedSubcategory(sub);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('subcategory', sub);
      setSearchParams(newParams);
    }
  };

  const handleResetFilters = () => {
    setIsOrganic(undefined);
    setMaxPrice(5000);
    setSort('popular');
    setSelectedLocation('');
    setSelectedSubcategory('');
    const newParams = new URLSearchParams();
    if (queryParam) newParams.set('q', queryParam);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Category Header Banner */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-sm">nature</span>
            Direct Farm Catalog • 100% Authentic Indian Produce
          </div>
          <h1 className="font-poppins font-bold text-3xl text-on-surface capitalize flex items-center gap-2">
            <span>{activeCategoryName}</span>
            {products && !isLoading && (
              <span className="text-sm font-normal text-on-surface-variant bg-white border border-outline-variant/40 px-2.5 py-0.5 rounded-full">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {queryParam
              ? `Showing verified mandi harvests matching your search "${queryParam}".`
              : 'Directly sourced from trusted farmers across Panipat, Karnal, Nashik, Kashmir and more.'}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-on-surface-variant uppercase">Sort By:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="popular">Popularity</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Harvest</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Scroll Pills (All 14 Indian Agricultural Categories) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = (!slug && cat.slug === '') || slug === cat.slug;
            const targetUrl = cat.slug ? `/category/${cat.slug}` : '/category';
            return (
              <Link
                key={cat.slug || 'all'}
                to={targetUrl}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Subcategory Chips (when subcategories exist) */}
        {availableSubcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-on-surface-variant text-[11px] uppercase tracking-wider shrink-0 mr-1">
              Subcategories:
            </span>
            {availableSubcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-white border border-outline-variant/50 text-on-surface-variant hover:border-secondary hover:text-secondary'
                  }`}
                >
                  {sub}
                  {isSelected && ' ✕'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid + Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 h-fit space-y-6">
          <h3 className="font-poppins font-bold text-lg text-on-surface pb-3 border-b border-outline-variant/30 flex items-center justify-between">
            <span>Filter Harvest</span>
            <span className="material-symbols-outlined text-outline">tune</span>
          </h3>

          {/* Regional Mandi / Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Origin / Mandi Region
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value) newParams.set('location', e.target.value);
                else newParams.delete('location');
                setSearchParams(newParams);
              }}
              className="w-full bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary shadow-sm"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Organic Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Purity Certification
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <input
                type="checkbox"
                id="organic-check"
                checked={isOrganic === true}
                onChange={(e) => setIsOrganic(e.target.checked ? true : undefined)}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
              <span className="text-xs text-on-surface font-semibold flex items-center gap-1">
                <span>🌿</span> 100% Certified Organic Only
              </span>
            </label>
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
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant font-medium">
              <span>₹50</span>
              <span>₹2,500</span>
              <span>₹5,000+</span>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(isOrganic !== undefined || maxPrice < 5000 || selectedLocation || selectedSubcategory) && (
            <div className="pt-2 border-t border-outline-variant/30 space-y-2">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase block">Active Filters</span>
              <div className="flex flex-wrap gap-1.5">
                {isOrganic && (
                  <span className="text-[10px] bg-secondary-container text-on-secondary-container font-semibold px-2 py-0.5 rounded-md">
                    Organic Only
                  </span>
                )}
                {maxPrice < 5000 && (
                  <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md">
                    Under ₹{maxPrice}
                  </span>
                )}
                {selectedLocation && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-md">
                    📍 {selectedLocation}
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="text-[10px] bg-purple-100 text-purple-900 font-semibold px-2 py-0.5 rounded-md">
                    {selectedSubcategory}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="w-full text-xs font-bold text-outline hover:text-error transition-colors py-2 text-center border border-dashed border-outline-variant/60 rounded-xl hover:border-error"
          >
            Reset All Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-surface-container-low rounded-2xl h-80 animate-pulse border border-outline-variant/30"></div>
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="bg-surface-container-low text-center py-16 px-6 rounded-3xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-3 block">eco</span>
              <h3 className="font-poppins font-bold text-xl text-on-surface">No Agricultural Products Found</h3>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-md mx-auto">
                No produce matches your current filter or search criteria. Try removing filters or searching for different keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-sm"
              >
                Clear All Filters & Show All Produce
              </button>
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
