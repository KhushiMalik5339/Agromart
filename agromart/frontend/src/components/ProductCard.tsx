import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { RatingStars } from './RatingStars';
import { useCartStore } from '../store/cartStore';
import { api } from '../lib/axios';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setCart, openCart } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post('/cart/items', {
        product_id: product.id,
        qty: 1,
      });
      setCart(res.data);
      openCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <div className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden card-elevation-1 hover:card-elevation-2 transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.is_organic && (
            <span className="bg-secondary-container/90 text-on-secondary-container text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
              100% Organic
            </span>
          )}
          {product.badges && product.badges[0] && (
            <span className="bg-primary/85 text-on-primary text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
              {product.badges[0]}
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">agriculture</span>
          {product.farm_name || 'Green Valley Farm'}
        </div>

        <Link to={`/product/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-poppins font-semibold text-base text-on-surface line-clamp-1 mb-1">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating_avg} count={product.rating_count} size="sm" />
        </div>

        {/* Price & Add CTA */}
        <div className="mt-auto pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          <div>
            <span className="text-xl font-bold text-primary">₹{product.price}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">/{product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-on-surface font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
