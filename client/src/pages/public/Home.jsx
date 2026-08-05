import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/product/SkeletonCard';
import { fetchProducts, fetchCategories, subscribeToNewsletter } from '../../services/productService';
import { ToastContext } from '../../context/ToastContext';
import { ArrowRight, Sparkles, Flame, Star, Award, CheckCircle } from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [allProds, catsData] = await Promise.all([
          fetchProducts().catch(() => []),
          fetchCategories().catch(() => []),
        ]);

        if (Array.isArray(allProds)) {
          setFeaturedProducts(allProds.filter((p) => p.isFeatured).slice(0, 4));
          setDeals(allProds.filter((p) => p.isDeal || p.discount > 10).slice(0, 4));
          setBestsellers(allProds.filter((p) => p.isBestSeller).slice(0, 4));
        }

        if (Array.isArray(catsData)) {
          setCategories(catsData);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await subscribeToNewsletter(newsletterEmail);
      addToast('Thank you for subscribing to ShopEZ newsletter!', 'success');
      setNewsletterEmail('');
    } catch (err) {
      addToast(err.message || 'Subscription failed', 'error');
    }
  };

  return (
    <MainLayout>
      {/* Hero Banner Section */}
      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.15), transparent 70%), var(--bg-main)',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> Premium E-Commerce Experience
            </span>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
              Your One-Stop Destination for <span style={{ background: 'linear-gradient(135deg, var(--primary-400), var(--accent-pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Effortless Shopping</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '540px' }}>
              Discover curated high-tech electronics, fashion, lifestyle essentials, and home decor with lightning-fast delivery and secure checkout.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/products" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/offers" className="btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                View Deals <Flame size={18} color="var(--accent-amber)" />
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
              alt="ShopEZ Hero Banner"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)', aspectRatio: '4/3', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem' }}>Popular Categories</h2>
              <p style={{ color: 'var(--text-muted)' }}>Browse curated collections across your favorite categories</p>
            </div>
            <Link to="/categories" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
              View All Categories
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary-500)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '0.85rem',
                    border: '2px solid var(--primary-500)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section style={{ padding: '4rem 0', background: 'rgba(17, 24, 39, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
                <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} /> Limited Time Offers
              </span>
              <h2 style={{ fontSize: '2rem' }}>Today's Best Deals</h2>
            </div>
            <Link to="/offers" className="btn-secondary">View All Deals</Link>
          </div>

          <div className="product-grid">
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : deals.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem' }}>Featured Products</h2>
              <p style={{ color: 'var(--text-muted)' }}>Top picks selected for exceptional quality and performance</p>
            </div>
            <Link to="/products" className="btn-secondary">Explore All</Link>
          </div>

          <div className="product-grid">
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section style={{ padding: '4rem 0', background: 'rgba(17, 24, 39, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                <Award size={14} style={{ display: 'inline', marginRight: '4px' }} /> Most Popular
              </span>
              <h2 style={{ fontSize: '2rem' }}>Best Sellers</h2>
            </div>
            <Link to="/products" className="btn-secondary">See Catalog</Link>
          </div>

          <div className="product-grid">
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : bestsellers.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Loved by Thousands of Shoppers</h2>
            <p style={{ color: 'var(--text-muted)' }}>Read what verified customers have to say about their ShopEZ experience</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', color: 'var(--accent-amber)', gap: '0.2rem', marginBottom: '1rem' }}>
                {Array(5).fill(0).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "ShopEZ is hands down the smoothest shopping app I have used! Delivery arrived 2 days earlier than scheduled."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Customer" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Sarah Jenkins</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Verified Buyer</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', color: 'var(--accent-amber)', gap: '0.2rem', marginBottom: '1rem' }}>
                {Array(5).fill(0).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "Great product quality, responsive customer service, and fantastic discounts on electronics!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Customer" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>David Miller</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Verified Buyer</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', color: 'var(--accent-amber)', gap: '0.2rem', marginBottom: '1rem' }}>
                {Array(5).fill(0).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "The checkout process was super easy. Ordering my workstation desk chair was completely hassle-free."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" alt="Customer" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Emily Watson</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, var(--primary-900), var(--bg-surface))', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Join the ShopEZ VIP Club</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Subscribe to receive exclusive deals, flash sale alerts, and 10% off your first order!
          </p>

          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="form-input"
              style={{ flex: 1, borderRadius: 'var(--radius-full)', paddingLeft: '1.5rem' }}
              required
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 2rem' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};
