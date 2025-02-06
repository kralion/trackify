import { Order, OrderStore } from '@/types';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner-native';
import { create } from 'zustand';

export const useOrder = create<OrderStore>((set) => ({
  orders: [] as Order[],
  addOrder: async (order: Order) => {
    const { error } = await supabase.from('orders').insert(order);
    toast.success('Orden enviada');
    if (error) console.log(error);
  },
  getOrder: async (orderId: number) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, delivery(id_delivery, *)')
      .eq('id', orderId)
      .single();
    if (error) {
      console.log(error);
    } else {
      return data;
    }
  },
  updateOrder: async (orderId: number, update: Partial<Order>) => {
    const { error } = await supabase
      .from('orders')
      .update({ ...update })
      .eq('id', orderId);
    if (error) {
      console.log(error);
      toast.error(error.message);
    } else {
      toast.success('Orden actualizada');
    }
  },
  deleteOrder: (orderId: number) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    })),
}));
