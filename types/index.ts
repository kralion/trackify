import * as Location from 'expo-location';
export type Order = {
  id: number;
  origin: Location.LocationObjectCoords;
  status: string;
  distance: number;
  duration: number;
  destination: Location.LocationObjectCoords;
  id_delivery?: string | null;
  deliveries?: Delivery[];
  customer: string;
  items: Product[];
};

export type Delivery = {
  id: number;
  name: string;
  phone: string;
  status: string;
  percentage: number;
  color: string;
};

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: boolean;
  id_category: number;
  categories?: Category;
}

export type Category = {
  id: number;
  name: string;
  icon: string;
};

export interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  setProducts: (products: Product[]) => void;
  loading: boolean;
  getAllProductByUser: (userId: string) => Promise<Product[]>;
  getProductsByCategoryOrSearch: (categoryId: number | null, search: string, userId: string) => Promise<Product[]>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: number) => void;
  itemCount: number;
}

export interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  getCategories: () => Promise<Category[]>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}
export interface CartState {
  items: Product[];
  addItem: (item: Product) => void;
  setItems: (items: Product[]) => void;
  removeItem: (id: number) => void;
  itemCount: number;
}

export interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (orderId: number, update: Partial<Order>) => void;
  deleteOrder: (orderId: number) => void;
  getOrder: (orderId: number) => Promise<Order | undefined>;
}
