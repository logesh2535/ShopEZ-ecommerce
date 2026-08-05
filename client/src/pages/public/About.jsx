import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ShoppingBag, ShieldCheck, Users, Zap } from 'lucide-react';

export const About = () => {
  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Breadcrumb items={[{ label: 'About Us' }]} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>About ShopEZ</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Tagline: <em>"Your One-Stop Destination for Effortless Online Shopping."</em>
          </p>
        </div>

        <div className="glass-card" style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Founded with the goal of revolutionizing online commerce, ShopEZ combines a high-speed reactive user interface with curated premium inventory, transparent pricing, and instant customer service. Whether you are shopping for top-tier audio gear, smart wearables, minimalist fashion, or ergonomic home workspace furniture, ShopEZ delivers quality without compromise.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Zap size={32} color="var(--primary-400)" style={{ marginBottom: '0.75rem' }} />
              <h4>Lightning Fast</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ultra-responsive browsing & express shipping.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ShieldCheck size={32} color="var(--accent-emerald)" style={{ marginBottom: '0.75rem' }} />
              <h4>100% Secure</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Encrypted payment gateways and JWT security.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Users size={32} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
              <h4>Customer First</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>24/7 dedicated support desk for all inquiries.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
