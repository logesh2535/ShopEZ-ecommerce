import React, { useState, useContext } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { updateUserProfile } from '../../services/authService';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export const EditProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const updated = await updateUserProfile(payload);
      updateUser(updated);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout title="Edit Profile Details">
      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleProfileSubmit}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            Personal Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <h3 style={{ fontSize: '1.3rem', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            Shipping Address
          </h3>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.3rem', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            Change Password (Optional)
          </h3>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', padding: '0.85rem 2rem' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
};
