import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProductCard } from '../../components/product/ProductCard';
import { fetchProducts } from '../../services/productService';
import { Flame, Tag } from 'lucide-react';

export const Offers = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ deal: 'true' }).then((data) => setDealProducts(data)).finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Breadcrumb items={[{ label: 'Offers & Deals' }]} />

        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <span className="badge badge-warning" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <Flame size={16} style={{ display: 'inline', marginRight: '4px' }} /> Exclusive Flash Sale
          </span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Today's Hot Deals & Discounts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Save up to 30% on select premium electronics, accessories, and home items.</p>
        </div>

        <div className="product-grid">
          {dealProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
