import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { DataService } from '../services/dataService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Handler for offline / sleeping Render server / demo mode
function handleMockFallback(config: AxiosRequestConfig): AxiosResponse | null {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const currentUser = useAuthStore.getState().user;
  const userId = currentUser?.id || 'c-1';

  // 1. Categories
  if (url === '/categories' && method === 'get') {
    return {
      data: DataService.getCategories(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 2. Featured Products
  if (url === '/products/featured' && method === 'get') {
    return {
      data: DataService.getFeaturedProducts(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 3. Products Search
  if (url.startsWith('/products/search') && method === 'get') {
    const qMatch = url.match(/[?&]q=([^&]+)/);
    const q = qMatch ? decodeURIComponent(qMatch[1]) : '';
    return {
      data: DataService.getProducts({ search: q }),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 4. Products List
  if (url.startsWith('/products') && !url.includes('/featured') && !url.includes('/search') && method === 'get') {
    // Check if single product slug/id: e.g. /products/kashmiri-apples
    const parts = url.split('?')[0].split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'products') {
      const slugOrId = parts.length === 3 && parts[1] === 'slug' ? parts[2] : parts[1];
      const product = DataService.getProductBySlugOrId(slugOrId);
      if (product) {
        return {
          data: product,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as InternalAxiosRequestConfig,
        };
      }
    }

    // Filtered query
    const searchParams = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
    const category = searchParams.get('category') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const isOrganic = searchParams.has('is_organic') ? searchParams.get('is_organic') === 'true' : undefined;
    const maxPrice = searchParams.has('max_price') ? Number(searchParams.get('max_price')) : undefined;
    const search = searchParams.get('search') || undefined;

    const list = DataService.getProducts({ category, sort, isOrganic, maxPrice, search });
    return {
      data: list,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 5. Admin Stats
  if ((url === '/admin/stats' || url === '/admin/analytics') && method === 'get') {
    return {
      data: DataService.getAdminStats(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 6. Admin Orders
  if (url.startsWith('/admin/orders') && method === 'get') {
    return {
      data: DataService.getOrders(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 7. Admin update order status
  if (url.match(/\/admin\/orders\/[^/]+\/status/) && method === 'patch') {
    const parts = url.split('/');
    const orderId = parts[3];
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const updated = DataService.updateOrderStatus(orderId, body.order_status);
    return {
      data: updated,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 8. Admin Users
  if (url === '/admin/users' && method === 'get') {
    const customers = DataService.getCustomers();
    const farmers = DataService.getFarmers();
    const all = [
      ...customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        role: 'customer',
        status: c.status,
        created_at: c.created_at,
        total_orders: c.total_orders,
        total_spent: c.total_spent,
      })),
      ...farmers.map((f) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        phone: f.phone,
        role: 'farmer',
        status: f.status,
        farm_name: f.farm_name,
        created_at: f.created_at,
        total_sales: f.total_sales,
        orders_count: f.orders_count,
      })),
    ];
    return {
      data: all,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 9. Admin Farmers
  if (url === '/admin/farmers' && method === 'get') {
    return {
      data: DataService.getFarmers(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.match(/\/admin\/farmers\/[^/]+\/approve/) && method === 'patch') {
    const parts = url.split('/');
    const farmerId = parts[3];
    const farmer = DataService.approveFarmer(farmerId);
    return {
      data: farmer,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.match(/\/admin\/farmers\/[^/]+\/reject/) && method === 'patch') {
    const parts = url.split('/');
    const farmerId = parts[3];
    const farmer = DataService.rejectFarmer(farmerId);
    return {
      data: farmer,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.match(/\/admin\/farmers\/[^/]+\/verify/) && method === 'patch') {
    const parts = url.split('/');
    const farmerId = parts[3];
    const farmer = DataService.approveFarmer(farmerId);
    return {
      data: { message: 'Farmer verified', farmer },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 10. Farmer Profile & Analytics
  if (url === '/farmer/profile' && method === 'get') {
    const farmer = DataService.getFarmers().find((f) => f.email === currentUser?.email) || DataService.getFarmers()[0];
    return {
      data: farmer,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url === '/farmer/analytics' && method === 'get') {
    const farmer = DataService.getFarmers().find((f) => f.email === currentUser?.email) || DataService.getFarmers()[0];
    const stats = DataService.getFarmerStats(farmer.id);
    return {
      data: {
        total_revenue: stats.total_sales,
        total_orders: stats.total_orders,
        total_items_sold: stats.items_sold,
        active_products: stats.total_products,
        customer_rating: 4.9,
        available_stock: stats.available_stock,
        pending_orders: stats.pending_orders,
        monthly_sales: [
          { month: 'Jan', sales: 18400 },
          { month: 'Feb', sales: 24200 },
          { month: 'Mar', sales: stats.total_sales },
        ],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if ((url === '/farmer/products' || url === '/farmer/inventory') && method === 'get') {
    const farmer = DataService.getFarmers().find((f) => f.email === currentUser?.email) || DataService.getFarmers()[0];
    const prods = DataService.getProducts({ farmerId: farmer.id });
    return {
      data: prods,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url === '/farmer/products' && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const farmer = DataService.getFarmers().find((f) => f.email === currentUser?.email) || DataService.getFarmers()[0];
    const created = DataService.addProduct({
      ...body,
      farmer_id: farmer.id,
      farmer_name: farmer.name,
      farm_name: farmer.farm_name,
    });
    return {
      data: created,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.startsWith('/farmer/products/') && method === 'put') {
    const id = url.split('/').pop() || '';
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const updated = DataService.updateProduct(id, body);
    return {
      data: updated,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.startsWith('/farmer/products/') && method === 'delete') {
    const id = url.split('/').pop() || '';
    DataService.deleteProduct(id);
    return {
      data: { message: 'Deleted successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url === '/farmer/orders' && method === 'get') {
    const farmer = DataService.getFarmers().find((f) => f.email === currentUser?.email) || DataService.getFarmers()[0];
    const orders = DataService.getOrders(undefined, farmer.id);
    return {
      data: orders,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 11. Customer Orders
  if (url === '/orders' && method === 'get') {
    return {
      data: DataService.getOrders(userId),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.startsWith('/orders/') && !url.includes('/status') && method === 'get') {
    const id = url.split('/')[2];
    const order = DataService.getOrderById(id);
    return {
      data: order,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // Cart Endpoints
  if (url === '/cart' && method === 'get') {
    const currentCart = useCartStore.getState().cart || {
      id: 'cart-1',
      user_id: userId,
      items: [],
      subtotal: 0,
      item_count: 0,
    };
    return {
      data: currentCart,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url === '/cart/items' && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const prod = DataService.getProductBySlugOrId(body.product_id);
    const prevCart = useCartStore.getState().cart || {
      id: 'cart-1',
      user_id: userId,
      items: [],
      subtotal: 0,
      item_count: 0,
    };

    const existingIdx = prevCart.items.findIndex((i: any) => i.product_id === body.product_id);
    let updatedItems = [...prevCart.items];
    if (existingIdx >= 0) {
      updatedItems[existingIdx].qty += Number(body.qty || 1);
    } else if (prod) {
      updatedItems.push({
        product_id: prod.id,
        qty: Number(body.qty || 1),
        price_snapshot: prod.price,
        product: prod,
      });
    }

    const subtotal = updatedItems.reduce((sum, item) => sum + item.price_snapshot * item.qty, 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.qty, 0);
    const updatedCart = {
      ...prevCart,
      items: updatedItems,
      subtotal,
      item_count: itemCount,
    };
    useCartStore.getState().setCart(updatedCart);

    return {
      data: updatedCart,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // Checkout Calculate
  if (url.includes('/checkout/calculate') && method === 'post') {
    const currentCart = useCartStore.getState().cart;
    const subtotal = currentCart?.subtotal || 0;
    const gst = Math.round(subtotal * 0.05);
    const delivery = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const discount = 0;
    const total = subtotal + gst + delivery - discount;
    return {
      data: {
        subtotal,
        gst,
        delivery_fee: delivery,
        discount,
        total,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // Checkout Create Order
  if ((url.includes('/checkout/create-order') || url === '/checkout/order') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const currentCart = useCartStore.getState().cart;
    const addresses = DataService.getAddresses(userId);
    const chosenAddress = addresses.find((a) => a.id === body.address_id) || addresses[0] || {
      label: 'Home',
      line1: 'Green Park Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    };

    const subtotal = currentCart?.subtotal || 100;
    const gst = Math.round(subtotal * 0.05);
    const delivery_fee = subtotal > 499 ? 0 : 49;
    const discount = 0;
    const total = subtotal + gst + delivery_fee - discount;

    const orderItems = currentCart?.items.map((i: any) => ({
      product_id: i.product_id,
      title: i.product?.title || 'Organic Produce',
      price: i.price_snapshot,
      qty: i.qty,
      unit: i.product?.unit || 'kg',
      image: i.product?.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200',
    })) || [];

    const order = DataService.createOrder({
      user_id: userId,
      items: orderItems,
      address: chosenAddress,
      subtotal,
      gst,
      delivery_fee,
      discount,
      total,
      payment_method: body.payment_method || 'razorpay',
      payment_status: body.payment_method === 'cod' ? 'pending_cod' : 'paid',
    });

    // Clear cart after order creation
    useCartStore.getState().clearCartState();

    return {
      data: order,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // Checkout Verify Payment
  if (url.includes('/checkout/verify-payment') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const order = DataService.getOrderById(body.order_id);
    if (order) {
      order.payment_status = 'paid';
    }
    return {
      data: order || { message: 'Payment verified' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 12. Addresses
  if (url === '/auth/addresses' && method === 'get') {
    return {
      data: DataService.getAddresses(userId),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url === '/auth/addresses' && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const addr = DataService.addAddress(userId, body);
    return {
      data: addr,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.startsWith('/auth/addresses/') && method === 'delete') {
    const id = url.split('/').pop() || '';
    DataService.deleteAddress(userId, id);
    return {
      data: { message: 'Address removed' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 13. Wishlist
  if (url === '/wishlist' && method === 'get') {
    return {
      data: DataService.getWishlist(userId),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  if (url.startsWith('/wishlist/') && method === 'post') {
    const prodId = url.split('/').pop() || '';
    const added = DataService.toggleWishlist(userId, prodId);
    return {
      data: { added },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 14. Auth Login
  if (url === '/auth/login' && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const email = body.email?.toLowerCase();

    let userRole: 'customer' | 'farmer' | 'admin' = 'customer';
    let name = 'Priya Sharma';

    if (email?.includes('admin')) {
      userRole = 'admin';
      name = 'AgroMart Admin';
    } else if (email?.includes('farmer') || email?.includes('kashmir') || email?.includes('gurpreet') || email?.includes('gaushala')) {
      userRole = 'farmer';
      name = 'Rajesh Patel';
    }

    const mockUser = {
      id: userRole === 'farmer' ? 'f-1' : userRole === 'admin' ? 'admin-1' : 'c-1',
      name,
      email: body.email,
      role: userRole,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };

    return {
      data: {
        user: mockUser,
        access_token: 'agromart_mock_jwt_token_' + Date.now(),
        refresh_token: 'agromart_mock_refresh_token_' + Date.now(),
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  // 15. Auth Register
  if (url === '/auth/register' && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const isFarmer = body.role === 'farmer';

    if (isFarmer) {
      DataService.registerFarmer({
        name: body.name,
        email: body.email,
        phone: body.phone,
        farm_name: body.farm_name,
        village: body.village || body.farm_location,
        district: body.district,
        state: body.state,
        category: body.category,
        farming_type: body.farming_type,
        verification_details: body.verification_details,
      });
    }

    const mockUser = {
      id: `u-${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role,
      phone: body.phone,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
    };

    return {
      data: {
        user: mockUser,
        access_token: 'agromart_mock_jwt_token_' + Date.now(),
        refresh_token: 'agromart_mock_refresh_token_' + Date.now(),
      },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    };
  }

  return null;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If network error, timeout, or 404/500 on backend, gracefully fulfill with DataService!
    const mockRes = handleMockFallback(error.config);
    if (mockRes) {
      return mockRes;
    }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const newAccessToken = res.data.access_token;
          useAuthStore.getState().setTokens(newAccessToken, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
