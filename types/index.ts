export type Order = {
  destination: string;
  customerName: string;
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
