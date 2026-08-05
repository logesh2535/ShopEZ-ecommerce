import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Value Props Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          marginBottom: '3rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Free Shipping</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>On orders over $100</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>100% Protected Payments</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>30 Days Return</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hassle-free guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Multiple Payments</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cards, PayPal & COD</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Shop<span style={{ color: 'var(--primary-400)' }}>EZ</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Your One-Stop Destination for Effortless Online Shopping. Quality products delivered straight to your doorstep.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> 100 Store HQ Blvd, San Francisco, CA</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> +1 800 555 SHOP</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> support@shopez.com</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/categories">Product Categories</Link></li>
              <li><Link to="/offers">Special Offers & Deals</Link></li>
              <li><Link to="/about">About ShopEZ</Link></li>
              <li><Link to="/contact">Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Customer Account</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/customer/dashboard">My Account</Link></li>
              <li><Link to="/customer/orders">Order History</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/login">Sign In / Register</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} ShopEZ Inc. All rights reserved. Designed for Effortless E-Commerce.
        </div>
      </div>
    </footer>
  );
};
