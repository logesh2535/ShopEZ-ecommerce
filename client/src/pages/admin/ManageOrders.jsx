import React, { useEffect, useState, useContext } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { fetchOrders } from '../../services/orderService';
import { updateOrderStatus } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';

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
    <AdminLayout title="Manage Customer Orders & Status Updates">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <strong style={{ color: 'var(--primary-400)' }}>{ord.orderId || ord._id}</strong>
                  </td>
                  <td>{ord.userId?.name || 'Customer'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td>{ord.products?.length || 0} items</td>
                  <td>
                    <strong>${ord.grandTotal ? ord.grandTotal.toFixed(2) : '0.00'}</strong>
                  </td>
                  <td>{ord.paymentMethod}</td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="form-input"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
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
