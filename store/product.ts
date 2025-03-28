import { Product, ProductStore } from '@/types';
import { supabase } from '@/utils/supabase';
import { create } from 'zustand';

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
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
    set(() => ({
      loading: true,
    }));
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    set((state) => ({
      products: [...state.products, data],
    }));
    set(() => ({
      loading: false,
    }));
  },

async getAllProductByUser(userId: string) {
  set(() => ({
    loading: true,
  }));
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', "user_2rDGYUufUg0RLAGqQoz1cNX8urm")
    .eq('categories.id', 1);
  if (error) throw error;
  set(() => ({
    loading: false,
  }));
 return data;
},
async getProductsByCategoryOrSearch(categoryId: number | null, search: string, userId: string) {
  set(() => ({
    loading: true,
  }));
  let query = supabase
    .from('products')
    .select('*, categories(id, name, icon)')
    .eq('user_id', "user_2rDGYUufUg0RLAGqQoz1cNX8urm")
    .eq('id_category', 1);

  if (categoryId !== null) {
    query = query.eq('categories.id', categoryId);
  }

  if (search !== '') {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  set(() => ({
    products: data,
  }));
  set(() => ({
    loading: false,
  }));

  return data;
},

  async updateProduct(product) {
    set(() => ({
      loading: true,
    }));
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id);
    if (error) throw error;
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    }));
    set(() => ({
      loading: false,
    }));
  },

  async deleteProduct(id: number) {
    set(() => ({
      loading: true,
    }));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    set(() => ({
      loading: false,
    }));
  },
}));
