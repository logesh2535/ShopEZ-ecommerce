import React, { useEffect, useState, useContext } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { fetchOrders } from '../../services/orderService';
import { updateOrderStatus } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import { Truck, KeyRound, Clock, UserCheck } from 'lucide-react';

export const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(ToastContext);

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      addToast(`Order status updated to "${newStatus}"!`, 'success');
      loadOrders();
    } catch (err) {
      addToast(err.message || 'Failed updating order status', 'error');
    }
  };

  return (
    <AdminLayout title="Manage Customer Orders & Delivery Scheduling">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Delivery Mode & Slot</th>
              <th>OTP Code</th>
              <th>Grand Total</th>
              <th>Payment</th>
              <th>Live Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>Loading order schedules...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <strong style={{ color: 'var(--primary-400)' }}>{ord.orderId || ord._id}</strong>
                  </td>
                  <td>
                    <div>{ord.userId?.name || ord.shippingAddress?.fullName || 'Customer'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.shippingAddress?.phone}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                      {ord.deliveryType || 'Standard'}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> {ord.deliveryTimeSlot || 'Anytime'}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        color: 'var(--accent-emerald)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <KeyRound size={12} /> {ord.deliveryOTP || '4829'}
                    </span>
                  </td>
                  <td>
                    <strong>${ord.grandTotal ? ord.grandTotal.toFixed(2) : '0.00'}</strong>
                  </td>
                  <td>{ord.paymentMethod}</td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="form-input"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem', background: 'var(--bg-surface)' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing (Packed)</option>
                      <option value="Shipped">Shipped (In Transit)</option>
                      <option value="Out for Delivery">Out for Delivery 🛵</option>
                      <option value="Delivered">Delivered 🎉</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
