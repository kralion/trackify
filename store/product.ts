import { Product, ProductStore } from '@/types';
import { supabase } from '@/utils/supabase';
import { create } from 'zustand';

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set(() => ({ products })),
  itemCount: 0,
  async removeProduct(id: number) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
  addProduct: async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    set((state) => ({
      products: [...state.products, data],
    }));
  },

  async getProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    set(() => ({
      products: data,
    }));
    return data;
  },

  async updateProduct(product) {
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id);
    if (error) throw error;
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    }));
  },

  async deleteProduct(id: number) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
}));
