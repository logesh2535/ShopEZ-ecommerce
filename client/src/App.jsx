import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import { Home } from './pages/public/Home';
import { Products } from './pages/public/Products';
import { ProductDetails } from './pages/public/ProductDetails';
import { Categories } from './pages/public/Categories';
import { Offers } from './pages/public/Offers';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { NotFound } from './pages/public/NotFound';

// Customer Pages
import { CustomerDashboard } from './pages/customer/Dashboard';
import { EditProfile } from './pages/customer/EditProfile';
import { Cart } from './pages/customer/Cart';
import { Wishlist } from './pages/customer/Wishlist';
import { Checkout } from './pages/customer/Checkout';
import { OrderSuccess } from './pages/customer/OrderSuccess';
import { MyOrders } from './pages/customer/MyOrders';
import { OrderDetails } from './pages/customer/OrderDetails';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageProducts } from './pages/admin/ManageProducts';
import { AddProduct } from './pages/admin/AddProduct';
import { EditProduct } from './pages/admin/EditProduct';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageOrders } from './pages/admin/ManageOrders';
import { ManageUsers } from './pages/admin/ManageUsers';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';

import './styles/main.css';

export const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Routes */}
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/edit-profile" element={<EditProfile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/customer/orders" element={<MyOrders />} />
                <Route path="/customer/orders/:id" element={<OrderDetails />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/admin/products/add" element={<AddProduct />} />
                <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                <Route path="/admin/categories" element={<ManageCategories />} />
                <Route path="/admin/orders" element={<ManageOrders />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<Settings />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
