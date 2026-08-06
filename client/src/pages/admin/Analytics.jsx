import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { formatPrice, handleImageError } from '../../utils/formatCurrency';
import { fetchAdminDashboard } from '../../services/adminService';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard().then((res) => setData(res)).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout title="Advanced Analytics">
        <p style={{ color: 'var(--text-muted)' }}>Loading analytics report...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Store Sales & Performance Analytics">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Category Breakdown (Pie / Progress bar representation) */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="var(--primary-400)" /> Category Sales Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.categoryStats?.map((cat) => {
              const total = data.totalProducts || 1;
              const percent = Math.round((cat.count / total) * 100);
              return (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 600 }}>{cat._id || 'Uncategorized'}</span>
                    <span style={{ color: 'var(--primary-400)' }}>{percent}% ({cat.count} items)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary-500)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--accent-emerald)" /> Top Rated Products
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.topProducts?.map((p) => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <img src={p.images && p.images[0] ? p.images[0] : p.image} alt={p.name} onError={handleImageError} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{p.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⭐ {p.rating} ({p.reviewsCount} reviews)</span>
                </div>
                <strong style={{ fontSize: '1rem' }}>{formatPrice(p.price)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
