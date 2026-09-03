import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Product, Review } from '../types';
import { RatingStars } from '../components/RatingStars';
import { QuantityPicker } from '../components/QuantityPicker';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const { setCart, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/slug/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ['reviews', product?.id],
    queryFn: async () => {
      const res = await api.get(`/reviews/product/${product!.id}`);
      return res.data;
    },
    enabled: !!product?.id,
  });

  const { data: related } = useQuery<Product[]>({
    queryKey: ['related', product?.category_id],
    queryFn: async () => {
      const res = await api.get(`/products?category_id=${product!.category_id}&limit=4`);
      return res.data.filter((p: Product) => p.id !== product!.id).slice(0, 4);
    },
    enabled: !!product?.category_id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/cart/items', { product_id: product!.id, qty });
      return res.data;
    },
    onSuccess: (data) => {
      setCart(data);
      openCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      await api.post('/wishlist', { product_id: product!.id });
    },
    onSuccess: () => {
      setAddedToWishlist(true);
      setTimeout(() => setAddedToWishlist(false), 2000);
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      await api.post('/reviews', {
        product_id: product!.id,
        rating: reviewRating,
        comment: reviewText,
        photos: [],
      });
    },
    onSuccess: () => {
      setReviewText('');
      setReviewRating(5);
      qc.invalidateQueries({ queryKey: ['reviews', product?.id] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-surface-container-low rounded-3xl aspect-square" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-surface-container-low rounded-xl" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-outline">eco</span>
        <h2 className="font-poppins font-bold text-2xl text-on-surface">Product Not Found</h2>
        <Link to="/" className="text-primary font-semibold hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <Link to={`/category/${product.category_name?.toLowerCase()}`} className="hover:text-primary transition-colors capitalize">
          {product.category_name || 'Products'}
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-on-surface font-medium line-clamp-1">{product.title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden aspect-square bg-surface-container-low border border-outline-variant/30 card-elevation-1 group">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {product.is_organic && (
              <span className="absolute top-5 left-5 bg-secondary-container text-on-secondary-container text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                🌿 100% Organic
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-primary scale-105 shadow-md' : 'border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 lg:py-2">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.badges?.map((b) => (
              <span key={b} className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                {b}
              </span>
            ))}
            {product.is_organic && (
              <span className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-3 py-1 rounded-full">
                Certified Organic
              </span>
            )}
          </div>

          {/* Title & Farmer */}
          <div>
            <div className="flex items-center gap-2 text-sm text-secondary font-semibold mb-2">
              <span className="material-symbols-outlined text-base">agriculture</span>
              {product.farm_name || 'Organic Farm'}
            </div>
            <h1 className="font-poppins font-bold text-3xl xl:text-4xl text-on-surface leading-tight">{product.title}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating_avg} count={product.rating_count} size="md" />
            <span className="text-sm text-on-surface-variant">({product.rating_count} reviews)</span>
          </div>

          {/* Price */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30">
            <div className="flex items-baseline gap-2">
              <span className="font-poppins font-bold text-4xl text-primary">₹{product.price}</span>
              <span className="text-on-surface-variant font-medium">/{product.unit}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              {product.stock_qty > 0 ? (
                <>
                  <span className="w-2 h-2 bg-secondary rounded-full inline-block"></span>
                  <span className="text-secondary font-semibold">In Stock</span>
                  <span className="text-on-surface-variant">({product.stock_qty} {product.unit} available)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-error rounded-full inline-block"></span>
                  <span className="text-error font-semibold">Out of Stock</span>
                </>
              )}
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-on-surface">Quantity:</span>
              <QuantityPicker
                value={qty}
                min={1}
                max={Math.min(product.stock_qty, 20)}
                onChange={setQty}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={product.stock_qty === 0 || addToCartMutation.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-on-surface font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-xl">
                  {addedToCart ? 'check_circle' : 'add_shopping_cart'}
                </span>
                {addedToCart ? 'Added to Cart!' : addToCartMutation.isPending ? 'Adding…' : 'Add to Cart'}
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => addToWishlistMutation.mutate()}
                  className={`px-5 py-3.5 rounded-2xl border-2 font-semibold text-sm transition-all flex items-center gap-2 ${
                    addedToWishlist
                      ? 'bg-tertiary border-tertiary text-on-tertiary'
                      : 'border-outline-variant/60 hover:border-tertiary text-on-surface-variant hover:text-tertiary'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${addedToWishlist ? 'fill-1' : ''}`}>favorite</span>
                  {addedToWishlist ? 'Wishlisted' : 'Wishlist'}
                </button>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: 'local_shipping', text: 'Free Delivery', sub: 'Orders above ₹499' },
              { icon: 'verified_user', text: 'Farm Certified', sub: 'Organic certified' },
              { icon: 'replay', text: 'Easy Returns', sub: '3-day policy' },
            ].map((b) => (
              <div key={b.text} className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/20">
                <span className="material-symbols-outlined text-2xl text-primary">{b.icon}</span>
                <div className="text-xs font-bold text-on-surface mt-1">{b.text}</div>
                <div className="text-[10px] text-on-surface-variant">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Nutrition / Reviews */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 card-elevation-1 overflow-hidden">
        <div className="flex border-b border-outline-variant/30">
          {(['description', 'nutrition', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
              {tab === 'reviews' && reviews?.length ? ` (${reviews.length})` : ''}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <p className="text-on-surface-variant leading-relaxed text-base">{product.description}</p>
              {product.benefits?.length > 0 && (
                <div>
                  <h3 className="font-poppins font-semibold text-on-surface mb-3">Key Benefits</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary text-base mt-0.5 flex-shrink-0">check_circle</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <h3 className="font-poppins font-semibold text-on-surface">Nutrition Facts (per 100g)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(product.nutrition || {}).map(([key, val]) => (
                  <div key={key} className="bg-secondary-container/30 rounded-2xl p-4 text-center border border-secondary/20">
                    <div className="text-2xl font-bold text-on-surface font-poppins">{val}</div>
                    <div className="text-xs text-on-surface-variant font-medium capitalize mt-1">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review list */}
              {reviews && reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_name}`}
                            alt={r.user_name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-semibold text-sm text-on-surface">{r.user_name}</span>
                          {r.verified_purchase && (
                            <span className="text-[10px] text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full font-semibold">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <RatingStars rating={r.rating} size="sm" />
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl block mb-2 opacity-40">rate_review</span>
                  <p>No reviews yet. Be the first!</p>
                </div>
              )}

              {/* Add review form */}
              {isAuthenticated && (
                <div className="border-t border-outline-variant/30 pt-6">
                  <h4 className="font-poppins font-semibold text-on-surface mb-4">Write a Review</h4>
                  <div className="space-y-4">
                    {/* Star selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`text-3xl transition-transform hover:scale-110 ${
                            star <= reviewRating ? 'text-amber-400' : 'text-surface-container-highest'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-on-surface-variant">{reviewRating}/5</span>
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this product…"
                      rows={4}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                    <button
                      onClick={() => submitReviewMutation.mutate()}
                      disabled={!reviewText.trim() || submitReviewMutation.isPending}
                      className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
                    >
                      {submitReviewMutation.isPending ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-poppins font-bold text-2xl text-on-surface">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
