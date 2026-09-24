import { create } from 'zustand';
import { Cart, CartItem } from '../types';

interface CartStore {
  cart: Cart | null;
  isCartOpen: boolean;
  setCart: (cart: Cart) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCartState: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isCartOpen: false,
  setCart: (cart) => set({ cart }),
  updateQuantity: (productId, qty) =>
    set((state) => {
      if (!state.cart) return state;
      const items = state.cart.items
        .map((item) => (item.product_id === productId ? { ...item, qty } : item))
        .filter((item) => item.qty > 0);
      const subtotal = items.reduce((sum, item) => sum + item.price_snapshot * item.qty, 0);
      const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
      return {
        cart: {
          ...state.cart,
          items,
          subtotal,
          item_count: itemCount,
        },
      };
    }),
  removeItem: (productId) =>
    set((state) => {
      if (!state.cart) return state;
      const items = state.cart.items.filter((item) => item.product_id !== productId);
      const subtotal = items.reduce((sum, item) => sum + item.price_snapshot * item.qty, 0);
      const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
      return {
        cart: {
          ...state.cart,
          items,
          subtotal,
          item_count: itemCount,
        },
      };
    }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearCartState: () => set({ cart: null }),
}));
