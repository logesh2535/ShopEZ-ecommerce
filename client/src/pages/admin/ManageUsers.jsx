import React, { useEffect, useState, useContext } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { fetchUsers, deleteUser } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import { Trash2, UserCheck, Shield } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(ToastContext);

  const loadUsers = () => {
    setLoading(true);
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id, userName) => {
    if (window.confirm(`Delete user "${userName}"?`)) {
      try {
        await deleteUser(id);
        addToast(`User "${userName}" removed.`, 'info');
        loadUsers();
      } catch (err) {
        addToast(err.message || 'Failed removing user', 'error');
      }
    }
  };

  return (
    <AdminLayout title="Manage Registered Users">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Registered Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>Loading users...</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id}>
                <td>
                  <strong style={{ color: 'var(--text-main)' }}>{u.name}</strong>
                </td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td>
                  <span className={`badge badge-${u.role === 'admin' ? 'primary' : 'success'}`}>
                    {u.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDelete(u._id, u.name)} className="btn-danger" style={{ padding: '0.35rem 0.6rem' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
