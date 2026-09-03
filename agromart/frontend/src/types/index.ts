export type UserRole = 'customer' | 'farmer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface NutritionInfo {
  calories?: string;
  protein?: string;
  carbs?: string;
  fats?: string;
}

export interface Product {
  id: string;
  farmer_id: string;
  farmer_name?: string;
  farm_name?: string;
  title: string;
  slug: string;
  category_id: string;
  category_name?: string;
  description: string;
  benefits: string[];
  nutrition: NutritionInfo;
  images: string[];
  video_url?: string;
  price: number;
  unit: string;
  stock_qty: number;
  is_organic: boolean;
  badges: string[];
  rating_avg: number;
  rating_count: number;
  status: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  parent_id?: string | null;
  subcategories?: Category[];
}

export interface CartItem {
  product_id: string;
  qty: number;
  price_snapshot: number;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  item_count: number;
}

export interface Address {
  id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  qty: number;
  unit: string;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  gst: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'pending_cod';
  order_status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'razorpay' | 'cod';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  photos: string[];
  verified_purchase: boolean;
  created_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at?: string;
}
