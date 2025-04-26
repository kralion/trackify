import { CartState, Product } from '@/types';

import { create } from 'zustand';

function generateCartItemId(item: Product): string {
  if (!item.customizations) return `${item.id}`;
  return `${item.id}-${btoa(unescape(encodeURIComponent(JSON.stringify(item.customizations))))}`;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  setItems: (items: Product[]) => set(() => ({ items })),
  addItem: (item: Product): boolean => {
    const state = useCartStore.getState();
    const cartItemId = generateCartItemId(item);
    // Si el producto NO tiene customizaciones, no permitir duplicados por id
    if (!item.customizations) {
      const exists = state.items.some((i) => i.id === item.id && !i.customizations);
      if (exists) {
        // Producto ya existe
        return false;
      }
    }
    // Si tiene customizaciones, siempre lo agrega (aunque tenga el mismo id)
    set((state) => ({
      items: [...state.items, { ...item, cartItemId }],
    }));
    return true;
  },

  removeItem: (id: number) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  itemCount: 0,
}));

useCartStore;
