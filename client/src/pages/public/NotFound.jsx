import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFound = () => {
  return (
    <MainLayout>
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h1 style={{ fontSize: '5rem', color: 'var(--primary-400)', lineHeight: 1 }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
            <Home size={18} /> Return to Homepage
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};
