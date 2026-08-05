import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import '../styles/admin.css';

export const AdminLayout = ({ children, title = 'Admin Management' }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
    { label: 'Manage Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Shop<span style={{ color: 'var(--primary-400)' }}>EZ</span> Admin
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" className="btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <button onClick={logout} className="btn-danger" style={{ width: '100%', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>{title}</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Store Administration & Real-Time Management</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name || 'Administrator'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-400)' }}>Super Admin</div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};
