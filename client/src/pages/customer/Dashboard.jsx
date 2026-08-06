import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { formatPrice } from '../../utils/formatCurrency';
import { AuthContext } from '../../context/AuthContext';
import { fetchOrders } from '../../services/orderService';
import { ShoppingBag, Heart, User, Clock, ArrowRight } from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => setRecentOrders(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout title={`Welcome back, ${user?.name || 'Customer'}!`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account Role</span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-400)', textTransform: 'capitalize' }}>{user?.role || 'Customer'}</h3>
          </div>
          <User size={32} color="var(--primary-400)" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-emerald)' }}>{recentOrders.length}</h3>
          </div>
          <ShoppingBag size={32} color="var(--accent-emerald)" />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem' }}>Recent Order Activity</h3>
          <Link to="/customer/orders" className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            View All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No orders placed yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--primary-400)' }}>{order.orderId || order._id}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge badge-${order.status === 'Delivered' ? 'success' : 'warning'}`}>
                  {order.status}
                </span>
                <strong style={{ fontSize: '1.05rem' }}>{formatPrice(order.grandTotal || 0)}</strong>
                <Link to={`/customer/orders/${order._id}`} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                  Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
