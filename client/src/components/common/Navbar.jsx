import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ShoppingBag, Heart, Search, User, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import '../../styles/navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItemsCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          Shop<span>EZ</span>
        </Link>

        {/* Real-time Search Input */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search products, brands & categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Nav Links */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="/offers" className={`nav-link ${location.pathname === '/offers' ? 'active' : ''}`}>
                Offers
              </Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions (Wishlist, Cart, User Profile / Auth) */}
        <div className="nav-actions">
          <Link to="/wishlist" className="icon-badge-btn" title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="icon-badge-btn" title="Shopping Cart">
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && <span className="badge-count">{totalItemsCount}</span>}
          </Link>

          {user ? (
            <div className="user-profile-menu">
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  <Shield size={16} /> Admin Panel
                </Link>
              ) : (
                <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  <User size={16} /> {user.name.split(' ')[0]}
                </Link>
              )}
              <button onClick={logout} className="icon-badge-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
