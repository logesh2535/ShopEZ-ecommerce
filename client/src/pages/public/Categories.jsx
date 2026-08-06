import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { handleImageError } from '../../utils/formatCurrency';
import { fetchCategories } from '../../services/productService';
import { ArrowRight, Sparkles, Grid, Image as ImageIcon } from 'lucide-react';

const CategoryCard = ({ cat }) => {
  const categoryImages = cat.images && cat.images.length > 0
    ? cat.images
    : [cat.image];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={categoryImages[activeImageIndex] || cat.image}
          alt={cat.name}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease, transform 0.5s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 60%)',
          }}
        />
        
        <span
          className="badge badge-primary"
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles size={12} style={{ marginRight: '4px' }} /> Department
        </span>

        <span
          className="badge badge-secondary"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(0, 0, 0, 0.65)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ImageIcon size={12} style={{ marginRight: '4px' }} /> {categoryImages.length} Images
        </span>
      </div>

      {/* Mini Image Gallery Thumbnails */}
      {categoryImages.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '0.6rem 0.75rem',
            background: 'rgba(15, 23, 42, 0.5)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {categoryImages.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setActiveImageIndex(idx);
              }}
              onMouseEnter={() => setActiveImageIndex(idx)}
              style={{
                border: activeImageIndex === idx ? '2px solid var(--primary-400)' : '2px solid transparent',
                borderRadius: '6px',
                padding: 0,
                overflow: 'hidden',
                background: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'border-color 0.2s ease',
              }}
            >
              <img
                src={imgUrl}
                alt={`${cat.name} thumbnail ${idx + 1}`}
                onError={handleImageError}
                style={{ width: '40px', height: '36px', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.4rem', fontWeight: 700 }}>
            {cat.name}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '1rem' }}>
            {cat.description || 'Browse high quality products in this category'}
          </p>
        </div>

        <Link
          to={`/products?category=${encodeURIComponent(cat.name)}`}
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            padding: '0.6rem 1rem',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Explore Department <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Breadcrumb items={[{ label: 'Categories' }]} />

        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              <Grid size={14} style={{ display: 'inline', marginRight: '4px' }} /> Catalog Departments
            </span>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: 800 }}>Explore All Categories</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Hover or click thumbnails to preview 10 distinct, verified high-resolution images per category
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {loading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '340px', borderRadius: 'var(--radius-lg)' }} />
              ))
            : categories.map((cat) => (
                <CategoryCard key={cat._id || cat.name} cat={cat} />
              ))}
        </div>
      </div>
    </MainLayout>
  );
};
