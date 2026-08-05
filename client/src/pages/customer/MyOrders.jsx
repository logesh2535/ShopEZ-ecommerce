import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { fetchOrders } from '../../services/orderService';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout title="My Order History">
      <div className="glass-card" style={{ padding: '2rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '1.25rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--primary-400)', fontSize: '1.05rem' }}>{order.orderId || order._id}</strong>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                    {order.products?.length || 0} items • Payment: {order.paymentMethod}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span className={`badge badge-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>${order.grandTotal ? order.grandTotal.toFixed(2) : '0.00'}</span>
                  <Link to={`/customer/orders/${order._id}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Details <ArrowRight size={16} />
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
