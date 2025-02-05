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
  updateOrder: async (orderId: string, update: Partial<Order>) => {
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
  deleteOrder: (orderId: string) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    })),
}));
