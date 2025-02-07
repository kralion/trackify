import { CartState, Product } from '@/types';
import { create } from 'zustand';

export const useCartStore = create<CartState>((set) => ({
  items: [],
  setItems: (items: Product[]) => set(() => ({ items })),
  addItem: (item: Product) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (id: number) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  itemCount: 0,
}));

useCartStore;
