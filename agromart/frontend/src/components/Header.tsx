import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const ALL_CATEGORIES = [
  { name: 'Fruits', slug: 'fruits', icon: 'nutrition', emoji: '🍎', desc: 'Mangoes, Apples, Berries & Citrus' },
  { name: 'Vegetables', slug: 'vegetables', icon: 'eco', emoji: '🥬', desc: 'Fresh Onions, Palak, Tomatoes' },
  { name: 'Grains & Cereals', slug: 'grains', icon: 'grain', emoji: '🌾', desc: 'Basmati Rice, Sharbati Wheat & Millets' },
  { name: 'Pulses & Legumes', slug: 'pulses', icon: 'lunch_dining', emoji: '🫘', desc: 'Toor, Moong, Rajma & Chana' },
  { name: 'Dairy & Milk Products', slug: 'dairy', icon: 'egg', emoji: '🥛', desc: 'A2 Gir Cow Ghee, Milk & Fresh Paneer' },
  { name: 'Spices & Condiments', slug: 'spices', icon: 'local_florist', emoji: '🌸', desc: 'Kashmir Saffron, Haldi & Pepper' },
  { name: 'Oilseeds & Edible Oils', slug: 'oilseeds-oils', icon: 'opacity', emoji: '🌻', desc: 'Cold Pressed Mustard & Peanut Oil' },
  { name: 'Dry Fruits & Nuts', slug: 'dry-fruits', icon: 'cookie', emoji: '🥜', desc: 'Mamra Badam, Akhrot & Makhana' },
  { name: 'Seeds', slug: 'seeds', icon: 'spa', emoji: '🌱', desc: 'Certified Wheat, Paddy & Veg Seeds' },
  { name: 'Fertilizers & Manure', slug: 'fertilizers', icon: 'science', emoji: '🧪', desc: 'Vermicompost, Neem Cake & Manure' },
  { name: 'Agricultural Tools', slug: 'equipment', icon: 'precision_manufacturing', emoji: '🚜', desc: 'Spades, Sprayers & Drip Kits' },
  { name: 'Flowers & Plants', slug: 'plants', icon: 'yard', emoji: '🌹', desc: 'Desi Gulab, Tulsi & Live Saplings' },
  { name: 'Organic Products', slug: 'organic', icon: 'verified', emoji: '🌿', desc: '100% NPOP Certified Organic Range' },
  { name: 'Other Agricultural', slug: 'other-agriculture', icon: 'agriculture', emoji: '🍯', desc: 'Forest Honey, Desi Gur & Cattle Feed' },
];

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, toggleCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const cartItemCount = cart?.item_count || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant/40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-bold text-2xl tracking-tight text-primary leading-none">AgroMart</span>
              <span className="text-[10px] text-secondary font-medium tracking-wide">Kisan Direct Mandi</span>
            </div>
          </Link>

          {/* Search Bar Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Panipat onions, basmati, mangoes, saffron, seeds..."
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-full py-2.5 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
            <button type="submit" className="absolute left-3.5 top-2.5 text-outline">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </form>

          {/* Desktop Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Category Mega Dropdown Trigger */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">apps</span>
                All 14 Categories
                <span className="material-symbols-outlined text-sm transition-transform duration-200">
                  {isCatDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isCatDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCatDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-[580px] bg-white border border-outline-variant/40 rounded-2xl shadow-2xl p-4 z-50 grid grid-cols-2 gap-2 max-h-[80vh] overflow-y-auto">
                    <div className="col-span-2 pb-2 mb-1 border-b border-outline-variant/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                        Explore Agricultural Marketplace
                      </span>
                      <span className="text-[11px] text-secondary font-medium">14 Main Categories</span>
                    </div>
                    {ALL_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsCatDropdownOpen(false)}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-surface-container-low transition-colors group"
                      >
                        <span className="text-xl shrink-0 mt-0.5">{cat.emoji}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {cat.name}
                          </div>
                          <div className="text-[10px] text-on-surface-variant truncate">
                            {cat.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Desktop Links */}
            <nav className="hidden xl:flex items-center gap-4 text-xs font-bold text-on-surface-variant">
              <Link to="/category/fruits" className="hover:text-primary transition-colors">Fruits</Link>
              <Link to="/category/vegetables" className="hover:text-primary transition-colors">Vegetables</Link>
              <Link to="/category/grains" className="hover:text-primary transition-colors">Grains</Link>
              <Link to="/category/dairy" className="hover:text-primary transition-colors">Dairy</Link>
              <Link to="/category/spices" className="hover:text-primary transition-colors">Spices</Link>
              <Link to="/category/organic" className="text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-sm">verified</span>
                Organic
              </Link>
            </nav>

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className="relative bg-primary-container/15 hover:bg-primary-container/30 text-primary p-2.5 rounded-full transition-all flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <span className="material-symbols-outlined text-2xl">shopping_basket</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Auth / Account Controls */}
            {isAuthenticated && user ? (
              <div className="relative flex items-center gap-2">
                <Link
                  to={
                    user.role === 'farmer'
                      ? '/farmer/dashboard'
                      : user.role === 'admin'
                      ? '/admin/dashboard'
                      : '/account'
                  }
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <img
                    src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agro'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-container"
                  />
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-bold text-on-surface line-clamp-1">{user.name}</div>
                    <div className="text-[10px] text-secondary font-semibold uppercase">{user.role}</div>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-outline hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-primary hover:text-primary-container px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-on-surface hover:text-primary rounded-xl hover:bg-surface-container-low transition-colors"
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-outline-variant/40 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search onions, rice, mangoes, seeds..."
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-full py-2.5 pl-11 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
            <button type="submit" className="absolute left-3.5 top-2.5 text-outline">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </form>

          {/* 14 Categories Grid in Mobile Menu */}
          <div>
            <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-high transition-colors"
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-xs font-semibold text-on-surface truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold">
            <Link
              to="/farmer/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-secondary flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">agriculture</span>
              Farmer Portal
            </Link>
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-primary flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">shield_person</span>
              Admin Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
