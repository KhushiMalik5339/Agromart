import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, toggleCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartItemCount = cart?.item_count || 0;

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <div>
              <span className="font-poppins font-bold text-2xl tracking-tight text-primary">AgroMart</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold text-secondary tracking-widest block -mt-1">
                Organic Modernist
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organic saffron, spinach, mangoes..."
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-full py-2.5 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button type="submit" className="absolute left-3.5 top-2.5 text-outline">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Category Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-on-surface-variant">
              <Link to="/category/vegetables" className="hover:text-primary transition-colors">Vegetables</Link>
              <Link to="/category/fruits" className="hover:text-primary transition-colors">Fruits</Link>
              <Link to="/category/spices" className="hover:text-primary transition-colors">Spices & Saffron</Link>
              <Link to="/about" className="hover:text-primary transition-colors">Our Story</Link>
            </nav>

            {/* Notifications Icon */}
            <Link to="/notifications" className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className="relative bg-primary-container/15 hover:bg-primary-container/30 text-primary p-2.5 rounded-full transition-all flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <span className="material-symbols-outlined text-2xl">shopping_basket</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-on-surface font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
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
                  className="text-sm font-semibold text-primary hover:text-primary-container px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  Join AgroMart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
