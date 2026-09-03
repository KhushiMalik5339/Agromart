import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { QuantityPicker } from './QuantityPicker';
import { api } from '../lib/axios';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, closeCart, setCart } = useCartStore();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    if (isCartOpen) {
      fetchCart();
    }
  }, [isCartOpen]);

  const handleUpdateQty = async (productId: string, newQty: number) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { qty: newQty });
      setCart(res.data);
    } catch (err) {
      console.error('Error updating cart qty:', err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-outline-variant/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">shopping_basket</span>
              <h2 className="font-poppins font-bold text-xl text-on-surface">Your Cart</h2>
              <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cart?.item_count || 0} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">remove_shopping_cart</span>
                <p className="font-poppins font-semibold text-lg text-on-surface mb-1">Your cart is empty</p>
                <p className="text-sm text-outline mb-6">Discover farm-fresh organic produce to get started.</p>
                <button
                  onClick={closeCart}
                  className="bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 items-center"
                >
                  <img
                    src={item.product?.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200'}
                    alt={item.product?.title || 'Product'}
                    className="w-16 h-16 rounded-lg object-cover bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-poppins font-semibold text-sm text-on-surface truncate">
                      {item.product?.title || 'Organic Product'}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium mb-2">
                      ₹{item.price_snapshot} / {item.product?.unit || 'unit'}
                    </p>
                    <QuantityPicker
                      value={item.qty}
                      onChange={(newQty) => handleUpdateQty(item.product_id, newQty)}
                      size="sm"
                    />
                  </div>
                  <div className="text-right flex flex-col justify-between items-end h-full">
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="text-outline-variant hover:text-error transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    <span className="font-bold text-sm text-primary">
                      ₹{(item.price_snapshot * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart && cart.items.length > 0 && (
            <div className="p-6 border-t border-outline-variant/40 bg-surface-container-low space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-primary">
                    {cart.subtotal > 499 ? 'FREE' : '₹49.00'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/40 flex justify-between items-center font-bold text-lg text-on-surface">
                <span>Total Amount</span>
                <span className="text-primary">
                  ₹{(cart.subtotal + (cart.subtotal > 499 ? 0 : 49)).toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-1"
                >
                  Checkout
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
