import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { RatingStars } from './RatingStars';
import { useCartStore } from '../store/cartStore';
import { api } from '../lib/axios';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { setCart, openCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      const res = await api.post('/cart/items', {
        product_id: product.id,
        qty: 1,
      });
      setCart(res.data);
      openCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post('/cart/items', {
        product_id: product.id,
        qty: 1,
      });
      setCart(res.data);
      navigate('/checkout');
    } catch (err) {
      console.error('Failed to proceed to buy now:', err);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    try {
      if (!isWishlisted) {
        await api.post('/wishlist/items', { product_id: product.id });
      } else {
        await api.delete(`/wishlist/${product.id}`);
      }
    } catch (err) {
      // Graceful fallback for mock
    }
  };

  const originalPrice = product.original_price || Math.round(product.price * 1.2);
  const hasDiscount = originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden card-elevation-1 hover:card-elevation-2 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.is_organic && (
            <span className="bg-emerald-600/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Organic
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.badges && product.badges[0] && !product.is_organic && (
            <span className="bg-primary/90 text-on-primary text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
              {product.badges[0]}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button Right */}
        <button
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-md'
              : 'bg-white/85 text-on-surface-variant hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
        >
          <span className={`material-symbols-outlined text-lg ${isWishlisted ? 'fill-1' : ''}`}>
            favorite
          </span>
        </button>

        {/* Stock Status Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {product.stock_qty > 10 && (
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
              ● In Stock
            </span>
          )}
          {product.stock_qty !== undefined && product.stock_qty <= 10 && product.stock_qty > 0 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50/95 border border-amber-300 px-2 py-0.5 rounded-md backdrop-blur-sm">
              ⚡ Only {product.stock_qty} left
            </span>
          )}
          {product.stock_qty === 0 && (
            <span className="text-[10px] font-bold text-rose-800 bg-rose-50/95 border border-rose-300 px-2 py-0.5 rounded-md backdrop-blur-sm">
              ✕ Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Location */}
        <div className="flex items-center justify-between text-[11px] text-secondary font-semibold uppercase tracking-wider mb-1">
          <span className="truncate">{product.category_name || product.subcategory || 'Agricultural'}</span>
          <span className="text-on-surface-variant/80 font-normal truncate max-w-[120px] text-[10px]">
            {product.farmer_location || product.farm_name || 'India'}
          </span>
        </div>

        <Link to={`/product/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-poppins font-semibold text-sm sm:text-base text-on-surface line-clamp-1 mb-1" title={product.title}>
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-2">
          <RatingStars rating={product.rating_avg} count={product.rating_count} size="sm" />
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-3 border-t border-outline-variant/30 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-lg sm:text-xl font-bold text-primary">₹{product.price}</span>
              <span className="text-xs text-on-surface-variant ml-1 font-medium">/{product.unit}</span>
            </div>
            {hasDiscount && (
              <span className="text-xs text-on-surface-variant line-through font-normal">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_qty === 0 || isAdding}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-stone-900 font-bold text-xs py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
              Add
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock_qty === 0}
              className="w-full bg-primary hover:bg-primary-container text-on-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
