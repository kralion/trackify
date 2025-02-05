export type Order = {
  id?: string;
  origin: string;
  status: string;
  destination: string;
  id_delivery?: string | null;
  customer: string;
  items: CartItem[];
};
export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  itemCount: number;
}

export interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, update: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
}
