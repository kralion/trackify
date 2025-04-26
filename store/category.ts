import { Category, CategoryStore } from '@/types';
import { supabase } from '@/utils/supabase';
import { create } from 'zustand';

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  async addCategory(category: Omit<Category, 'id'>) {
    const { data, error } = await supabase.from('categories').insert(category).select().single();
    if (error) throw error;
    set((state) => ({
      categories: [...state.categories, data],
    }));
  },
  async getCategories() {
    set(() => ({
      loading: true,
    }));
      const { data, error } = await supabase.from('categories').select('*').order('order', { ascending: true });
    if (error) throw error;
    set(() => ({
      categories: data,
    }));
    set(() => ({
      loading: false,
    }));
    return data;
  },

  async updateCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', category.id);
    if (error) throw error;
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
    }));
  },

  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },
}));
