import * as Location from 'expo-location';
export type Order = {
  id?: number;
  origin: Location.LocationObjectCoords;
  status: string;
  distance: number;
  duration: number;
  destination: Location.LocationObjectCoords;
  id_delivery?: string | null;
  deliveries?: Delivery[];
  customer: string;
  items: CartItem[];
};

export type Delivery = {
  id_delivery: string;
  name: string;
  phone: string;
  status: string;
  percentage: number;
  color: string;
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
  updateOrder: (orderId: number, update: Partial<Order>) => void;
  deleteOrder: (orderId: number) => void;
  getOrder: (orderId: number) => Promise<Order | undefined>;
}
