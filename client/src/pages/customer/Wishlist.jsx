import React, { useContext } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProductCard } from '../../components/product/ProductCard';
import { WishlistContext } from '../../context/WishlistContext';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>My Saved Wishlist ({wishlist.length} items)</h1>
          <p style={{ color: 'var(--text-muted)' }}>Keep track of your favorite products and purchase them later</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
            <Heart size={56} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Click the heart icon on any product to save it to your wishlist!</p>
            <Link to="/products" className="btn-primary">
              Explore Catalog <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
