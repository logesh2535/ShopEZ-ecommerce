import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { CheckCircle, ShoppingBag, ArrowRight, KeyRound, Calendar, Clock, Truck, ShieldCheck } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <MainLayout>
      <div className="container" style={{ padding: '4rem 0 6rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(16, 185, 129, 0.4)' }}>
            <CheckCircle size={52} />
          </div>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Order Confirmed & Scheduled!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Thank you for shopping with ShopEZ. Your order has been scheduled for delivery with open-box verification.
          </p>

          {order && (
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.75rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <strong style={{ color: 'var(--primary-400)', fontSize: '1.1rem' }}>{order.orderId || order._id}</strong>
              </div>

              {/* Delivery OTP Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
                  <ShieldCheck size={18} /> Flipkart Delivery OTP:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 900, fontFamily: 'monospace', fontSize: '1.3rem', color: '#fff' }}>
                  <KeyRound size={16} color="#34d399" /> {order.deliveryOTP || '4829'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Delivery Type:</span>
                  <div style={{ fontWeight: 700, color: 'var(--primary-300)' }}>{order.deliveryType || 'Express Next Day'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Scheduled Time Slot:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.deliveryTimeSlot || 'Morning (9:00 AM - 1:00 PM)'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Grand Total Paid:</span>
                <span style={{ color: 'var(--primary-400)' }}>${order.grandTotal ? order.grandTotal.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {order && (
              <Link to={`/customer/orders/${order._id}`} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                <Truck size={18} /> Track Delivery Stepper
              </Link>
            )}
            <Link to="/customer/orders" className="btn-secondary" style={{ padding: '0.8rem 1.5rem' }}>
              <ShoppingBag size={18} /> View All Orders
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
