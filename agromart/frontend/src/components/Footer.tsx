import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-outline/30">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-inverse-primary flex items-center justify-center text-inverse-surface font-bold text-xl">
                <span className="material-symbols-outlined text-2xl">eco</span>
              </div>
              <span className="font-poppins font-bold text-2xl tracking-tight text-inverse-on-surface">AgroMart</span>
            </div>
            <p className="text-outline-variant text-sm leading-relaxed max-w-sm mb-6">
              Connecting local organic farmers directly with mindful consumers. Fresh, unadulterated produce delivered with complete farm-to-table transparency.
            </p>
            <div className="flex items-center gap-4 text-outline-variant">
              <span className="material-symbols-outlined text-2xl hover:text-inverse-primary cursor-pointer transition-colors">eco</span>
              <span className="material-symbols-outlined text-2xl hover:text-inverse-primary cursor-pointer transition-colors">local_shipping</span>
              <span className="material-symbols-outlined text-2xl hover:text-inverse-primary cursor-pointer transition-colors">verified_user</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-inverse-on-surface text-base mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-outline-variant">
              <li><Link to="/category/vegetables" className="hover:text-inverse-primary transition-colors">Fresh Vegetables</Link></li>
              <li><Link to="/category/fruits" className="hover:text-inverse-primary transition-colors">Organic Fruits</Link></li>
              <li><Link to="/category/spices" className="hover:text-inverse-primary transition-colors">Kashmiri Saffron & Spices</Link></li>
              <li><Link to="/category/seeds-grains" className="hover:text-inverse-primary transition-colors">Seeds & Grains</Link></li>
            </ul>
          </div>

          {/* Community & Farmers */}
          <div>
            <h4 className="font-poppins font-semibold text-inverse-on-surface text-base mb-4">For Farmers & Users</h4>
            <ul className="space-y-2.5 text-sm text-outline-variant">
              <li><Link to="/register?role=farmer" className="hover:text-inverse-primary transition-colors">Join as Certified Farmer</Link></li>
              <li><Link to="/farmer/dashboard" className="hover:text-inverse-primary transition-colors">Farmer Dashboard</Link></li>
              <li><Link to="/account/orders" className="hover:text-inverse-primary transition-colors">Track Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-inverse-primary transition-colors">My Wishlist</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-poppins font-semibold text-inverse-on-surface text-base mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-outline-variant">
              <li><Link to="/about" className="hover:text-inverse-primary transition-colors">Our Story & Mission</Link></li>
              <li><Link to="/blog" className="hover:text-inverse-primary transition-colors">Organic Farming Blog</Link></li>
              <li><Link to="/contact" className="hover:text-inverse-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline-variant">
          <p>© 2026 AgroMart Organic Modernist Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Razorpay (UPI, Cards, COD)</span>
            <span>·</span>
            <span>100% Verified Organic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
