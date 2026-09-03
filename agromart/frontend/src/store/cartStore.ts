import { create } from 'zustand';
import { Cart, CartItem, Product } from '../types';

interface CartStore {
  cart: Cart | null;
  isCartOpen: boolean;
  setCart: (cart: Cart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCartState: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isCartOpen: false,
  setCart: (cart) => set({ cart }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearCartState: () => set({ cart: null }),
}));
