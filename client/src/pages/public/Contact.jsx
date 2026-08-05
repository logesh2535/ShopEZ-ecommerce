import React, { useState, useContext } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ToastContext } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const { addToast } = useContext(ToastContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Thank you! Your message has been sent to ShopEZ support.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Get in Touch</h1>
          <p style={{ color: 'var(--text-muted)' }}>Have a question about an order, product, or business inquiry? We're here to help.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Contact Information</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <MapPin size={20} color="var(--primary-400)" />
              <div>
                <strong>Headquarters</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>100 Store HQ Blvd, San Francisco, CA 94105</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Phone size={20} color="var(--accent-emerald)" />
              <div>
                <strong>Customer Helpline</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>+1 800 555 SHOP (Mon-Fri, 9am-6pm EST)</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Mail size={20} color="var(--accent-pink)" />
              <div>
                <strong>Email Support</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>support@shopez.com</p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Your Name</label>
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
                <label>Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
