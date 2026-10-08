import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { FarmerLayout } from './layouts/FarmerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { RequireAuth } from './routes/guards';

// Eagerly loaded (critical path)
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Lazy loaded customer feature pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const CustomerDashboardPage = lazy(() => import('./pages/CustomerDashboardPage').then(m => ({ default: m.CustomerDashboardPage })));

// Lazy loaded Farmer pages
const FarmerDashboardPage = lazy(() => import('./pages/farmer/FarmerDashboardPage').then(m => ({ default: m.FarmerDashboardPage })));
const FarmerProductsPage = lazy(() => import('./pages/farmer/FarmerProductsPage').then(m => ({ default: m.FarmerProductsPage })));
const FarmerOrdersPage = lazy(() => import('./pages/farmer/FarmerOrdersPage').then(m => ({ default: m.FarmerOrdersPage })));
const FarmerSalesPage = lazy(() => import('./pages/farmer/FarmerSalesPage').then(m => ({ default: m.FarmerSalesPage })));
const FarmerProfilePage = lazy(() => import('./pages/farmer/FarmerProfilePage').then(m => ({ default: m.FarmerProfilePage })));

// Lazy loaded Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminFarmersPage = lazy(() => import('./pages/admin/AdminFarmersPage').then(m => ({ default: m.AdminFarmersPage })));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
        <span className="material-symbols-outlined text-on-primary text-2xl">eco</span>
      </div>
      <p className="text-sm text-on-surface-variant font-medium">Loading AgroMart…</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public + authenticated shared layout */}
        <Route element={<PublicLayout />}>
          {/* Open to all */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<CategoryPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Requires customer or any login */}
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            {/* Unified Customer Dashboard */}
            <Route path="/account" element={<CustomerDashboardPage />} />
            <Route path="/account/profile" element={<CustomerDashboardPage />} />
            <Route path="/account/orders" element={<CustomerDashboardPage />} />
            <Route path="/account/track" element={<CustomerDashboardPage />} />
          </Route>
        </Route>

        {/* Farmer portal */}
        <Route element={<RequireAuth allowedRoles={['farmer']} />}>
          <Route element={<FarmerLayout />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
            <Route path="/farmer/products" element={<FarmerProductsPage />} />
            <Route path="/farmer/inventory" element={<FarmerProductsPage />} />
            <Route path="/farmer/add-product" element={<FarmerProductsPage />} />
            <Route path="/farmer/orders" element={<FarmerOrdersPage />} />
            <Route path="/farmer/sales" element={<FarmerSalesPage />} />
            <Route path="/farmer/profile" element={<FarmerProfilePage />} />
            <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
          </Route>
        </Route>

        {/* Admin portal */}
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/farmers" element={<AdminFarmersPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/users" element={<AdminCustomersPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
