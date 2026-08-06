import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { formatPrice } from '../../utils/formatCurrency';
import { fetchOrders } from '../../services/orderService';
import { ShoppingBag, ArrowRight, Zap, Clock, KeyRound, Truck } from 'lucide-react';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'Delivered') return <span className="badge badge-success">Delivered 🎉</span>;
    if (status === 'Out for Delivery') return <span className="badge badge-warning" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fde047', border: '1px solid #eab308' }}>Out for Delivery 🛵</span>;
    if (status === 'Shipped') return <span className="badge badge-info" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', border: '1px solid #06b6d4' }}>Shipped 🚚</span>;
    if (status === 'Cancelled') return <span className="badge badge-danger">Cancelled</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  return (
    <CustomerLayout title="My Order History & Live Express Delivery Tracker">
      <div className="glass-card" style={{ padding: '2rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading delivery schedules...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No Orders Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any orders with ShopEZ yet.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '1.25rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <strong style={{ color: 'var(--primary-400)', fontSize: '1.1rem' }}>{order.orderId || order._id}</strong>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {order.deliveryType || 'Express'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>{order.products?.length || 0} items</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <KeyRound size={13} /> Delivery OTP: {order.deliveryOTP || '4829'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {getStatusBadge(order.status)}

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grand Total</div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {formatPrice(order.grandTotal || 0)}
                    </span>
                  </div>

                  <Link to={`/customer/orders/${order._id}`} className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
                    Track Delivery <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
