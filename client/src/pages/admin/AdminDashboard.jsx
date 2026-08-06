import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { formatPrice } from '../../utils/formatCurrency';
import { fetchAdminDashboard } from '../../services/adminService';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard()
      .then((res) => setData(res))
      .catch((err) => console.error('Admin dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout title="Admin Dashboard Overview">
        <p style={{ color: 'var(--text-muted)' }}>Loading Store Analytics...</p>
      </AdminLayout>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    monthlySales,
    recentOrders,
    stockAlerts,
    topProducts,
  } = data;

  return (
    <AdminLayout title="Dashboard Analytics & Store Control">
      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Revenue</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>
              {formatPrice(totalRevenue)}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <TrendingUp size={12} /> +18.4% from last month
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>{totalOrders}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)' }}>Orders processed</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary-400)' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Products</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>{totalProducts}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>In catalog</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Customers</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>{totalCustomers}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)' }}>Registered users</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: 'var(--accent-pink)' }}>
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* SVG Bar Chart for Monthly Revenue */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Monthly Revenue Overview (₹)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '180px', paddingTop: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          {monthlySales.map((item) => {
            const max = 15000;
            const heightPercent = (item.sales / max) * 100;
            return (
              <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  ₹{(item.sales / 1000).toFixed(1)}k
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '36px',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, var(--primary-500) 0%, var(--primary-800, #5b21b6) 100%)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    transition: 'var(--transition-smooth)',
                  }}
                  title={`Sales: ₹${item.sales}`}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Tables: Stock Alerts & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Stock Alerts */}
        <div className="admin-table-wrapper">
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.1rem' }}>Low Stock Inventory Alerts</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockAlerts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No stock alerts</td>
                </tr>
              ) : (
                stockAlerts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <Link to={`/admin/products/edit/${prod._id}`} style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {prod.name}
                      </Link>
                    </td>
                    <td>{prod.category}</td>
                    <td>{formatPrice(prod.price)}</td>
                    <td>
                      <span className="badge badge-danger">{prod.stock} Left</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Orders */}
        <div className="admin-table-wrapper">
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Store Orders</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <strong style={{ color: 'var(--primary-400)' }}>{ord.orderId || ord._id}</strong>
                  </td>
                  <td>{ord.userId?.name || 'Customer'}</td>
                  <td>
                    <span className={`badge badge-${ord.status === 'Delivered' ? 'success' : 'warning'}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td>{formatPrice(ord.grandTotal || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
