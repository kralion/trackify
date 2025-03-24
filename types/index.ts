export type Order = {
  id: number;
  customer: string,
  paymentMethod: string ;
  items: Product[];
  phone: string;
  user_id?: string
  totalPrice: number;
  location: string;
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
  description: string;
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
  getProductsByCategoryOrSearch: (categoryId: number | null, search: string) => Promise<Product[]>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: number) => void;
  itemCount: number;
}

export interface CategoryStore {
  categories: Category[];
  loading: boolean;
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
  loading: boolean;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (orderId: number, update: Partial<Order>) => void;
  deleteOrder: (orderId: number) => void;
  getOrder: (orderId: number) => Promise<Order | undefined>;
}
