import React, { useState, useContext } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ToastContext } from '../../context/ToastContext';
import { Save, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

export const Settings = () => {
  const [storeName, setStoreName] = useState('ShopEZ');
  const [tagline, setTagline] = useState('Your One-Stop Destination for Effortless Online Shopping.');
  const [supportEmail, setSupportEmail] = useState('support@shopez.com');
  const [currency, setCurrency] = useState('USD ($)');
  const { addToast } = useContext(ToastContext);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Store settings updated successfully!', 'success');
  };

  return (
    <AdminLayout title="Store Settings & Configuration">
      <div className="glass-card" style={{ maxWidth: '700px', padding: '2rem' }}>
        <form onSubmit={handleSave}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SettingsIcon size={20} color="var(--primary-400)" /> General Store Info
          </h3>

          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Store Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Currency Format</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="form-input">
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '0.85rem 2rem' }}>
            <Save size={18} /> Save Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
