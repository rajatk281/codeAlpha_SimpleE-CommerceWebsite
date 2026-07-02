import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('../pages/PaymentSuccessPage'));
const PaymentFailurePage = lazy(() => import('../pages/PaymentFailurePage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('../pages/admin/AdminProductFormPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('../pages/admin/AdminOrderDetailPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'));

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><LoadingSpinner size="lg" /></div>}>
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />

            {/* Protected routes */}
            <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
            <Route path="payment/failure" element={<ProtectedRoute><PaymentFailurePage /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="admin" element={<DashboardPage />} />
            <Route path="admin/products" element={<AdminProductsPage />} />
            <Route path="admin/products/new" element={<AdminProductFormPage />} />
            <Route path="admin/products/:id/edit" element={<AdminProductFormPage />} />
            <Route path="admin/orders" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/categories" element={<AdminCategoriesPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRoutes;
