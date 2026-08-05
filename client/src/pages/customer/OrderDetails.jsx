import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { fetchOrderById } from '../../services/orderService';
import { Truck, CheckCircle2, Clock, MapPin, CreditCard } from 'lucide-react';

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !order) {
    return (
      <CustomerLayout title="Order Details">
        <p style={{ color: 'var(--text-muted)' }}>Loading order information...</p>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title={`Order Details: ${order.orderId || order._id}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Ordered items */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Status</span>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge badge-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'warning'}`} style={{ fontSize: '0.85rem' }}>
                  {order.status}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date Placed</span>
              <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Purchased Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.products?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ${item.price?.toFixed(2)}
                  </div>
                </div>
                <strong style={{ fontSize: '1.05rem' }}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary-400)" /> Delivery Address
            </h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>{order.shippingAddress?.fullName}</strong><br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
              Phone: {order.shippingAddress?.phone}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Payment Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method</span>
                <strong>{order.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                <span>${order.taxAmount?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>${order.shippingFee?.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary-400)' }}>${order.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
