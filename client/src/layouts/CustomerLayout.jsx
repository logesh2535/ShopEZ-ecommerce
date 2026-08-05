import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { User, ShoppingBag, Heart, Edit3 } from 'lucide-react';

export const CustomerLayout = ({ children, title = 'Customer Portal' }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/customer/dashboard', icon: User },
    { label: 'My Orders', path: '/customer/orders', icon: ShoppingBag },
    { label: 'My Wishlist', path: '/wishlist', icon: Heart },
    { label: 'Edit Profile', path: '/customer/edit-profile', icon: Edit3 },
  ];

  return (
    <MainLayout>
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{title}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
          {/* Customer Side Navigation */}
          <aside className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`btn-${isActive ? 'primary' : 'secondary'}`}
                    style={{ justifyContent: 'flex-start', border: isActive ? 'none' : '1px solid transparent' }}
                  >
                    <Icon size={18} /> {item.label}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main customer content */}
          <div>{children}</div>
        </div>
      </div>
    </MainLayout>
  );
};
