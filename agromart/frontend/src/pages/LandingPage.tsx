import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const LandingPage: React.FC = () => {
  const { data: featuredProducts, isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await api.get('/products/featured');
      return res.data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-surface-container-low border-b border-outline-variant/30 overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-secondary-container/80 text-on-secondary-container text-xs font-semibold px-3.5 py-1.5 rounded-full border border-secondary/20 shadow-sm">
                <span className="material-symbols-outlined text-sm">agriculture</span>
                100% Traceable Farm-To-Home Market
              </div>

              <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-tight tracking-tight">
                Fresh From <span className="text-primary underline decoration-secondary-container decoration-wavy decoration-2">Organic Farms</span> To Your Table.
              </h1>

              <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
                Bypass middle-men. Support local certified organic farmers directly while enjoying pure Kashmir Saffron, fresh spinach, Alphonso mangoes, and native seeds.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/category/vegetables"
                  className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Shop Fresh Produce
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </Link>
                <Link
                  to="/about"
                  className="bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant/60 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm"
                >
                  Our Farmer Story
                </Link>
              </div>

              {/* Stat Pills */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-outline-variant/40">
                <div>
                  <div className="font-poppins font-bold text-2xl text-primary">100%</div>
                  <div className="text-xs text-on-surface-variant font-medium">Chemical-Free</div>
                </div>
                <div>
                  <div className="font-poppins font-bold text-2xl text-primary">500+</div>
                  <div className="text-xs text-on-surface-variant font-medium">Local Farmers</div>
                </div>
                <div>
                  <div className="font-poppins font-bold text-2xl text-primary">24h</div>
                  <div className="text-xs text-on-surface-variant font-medium">Harvest Delivery</div>
                </div>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1000"
                  alt="Organic Farmer Harvesting"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge Card */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/40 shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-on-surface">GI Tagged Saffron</div>
                  <div className="text-xs text-secondary font-medium">Direct Pampore Kashmir Harvest</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-on-surface">Explore Categories</h2>
            <p className="text-on-surface-variant text-sm mt-1">Handpicked organic harvests straight from nature.</p>
          </div>
          <Link to="/category/vegetables" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
            View All Categories
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: 'Fresh Vegetables', slug: 'vegetables', icon: 'eco', count: '45+ items', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
            { title: 'Organic Fruits', slug: 'fruits', icon: 'nutrition', count: '30+ items', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400' },
            { title: 'Spices & Saffron', slug: 'spices', icon: 'local_florist', count: '18+ items', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400' },
            { title: 'Seeds & Grains', slug: 'seeds-grains', icon: 'grain', count: '25+ items', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md border border-outline-variant/30 flex flex-col justify-end p-5 text-white"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent"></div>

              <div className="relative z-10 space-y-1">
                <span className="material-symbols-outlined text-2xl text-secondary-fixed">{cat.icon}</span>
                <h3 className="font-poppins font-bold text-lg leading-snug">{cat.title}</h3>
                <p className="text-xs text-secondary-fixed font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-on-surface">Top Organic Picks</h2>
            <p className="text-on-surface-variant text-sm mt-1">Certified pesticide-free produce rated highest by our community.</p>
          </div>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-surface-container-low rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Organic Modernism Story & Values */}
      <section className="bg-surface-container-low border-y border-outline-variant/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Why AgroMart</span>
            <h2 className="font-poppins font-bold text-3xl text-on-surface mt-1">
              Organic Modernism — Direct From Soil To Home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 card-elevation-1 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mx-auto">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-on-surface">100% Certified Organic</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Every farm on AgroMart undergoes strict soil purity and zero-chemical testing before listing.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 card-elevation-1 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary mx-auto">
                <span className="material-symbols-outlined text-3xl">handshake</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-on-surface">Fair Price to Farmers</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                By eliminating middle-men, farmers earn up to 40% more while consumers enjoy competitive prices.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 card-elevation-1 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container/30 flex items-center justify-center text-tertiary mx-auto">
                <span className="material-symbols-outlined text-3xl">schedule</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-on-surface">Same-Day Farm Harvest</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Produce is harvested only after your order is placed, ensuring peak freshness and nutrition.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
