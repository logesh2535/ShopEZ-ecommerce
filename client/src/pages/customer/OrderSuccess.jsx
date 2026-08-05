import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <MainLayout>
      <div className="container" style={{ padding: '5rem 0 7rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={48} />
          </div>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Thank you for shopping with ShopEZ. We've sent a confirmation email with your order tracking details.
          </p>

          {order && (
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <strong style={{ color: 'var(--primary-400)' }}>{order.orderId || order._id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid:</span>
                <strong>${order.grandTotal ? order.grandTotal.toFixed(2) : '0.00'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <span>{order.paymentMethod || 'Credit Card'}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/customer/orders" className="btn-secondary">
              <ShoppingBag size={18} /> View My Orders
            </Link>
            <Link to="/products" className="btn-primary">
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
