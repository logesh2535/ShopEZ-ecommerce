import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/product/SkeletonCard';
import { fetchProducts, fetchCategories } from '../../services/productService';
import { Search, Filter, SlidersHorizontal, Star, RefreshCw } from 'lucide-react';
import '../../styles/products.css';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res)).catch(() => {});
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const query = {};
        if (keyword) query.keyword = keyword;
        if (selectedCategory && selectedCategory !== 'All') query.category = selectedCategory;
        if (minPrice) query.minPrice = minPrice;
        if (maxPrice) query.maxPrice = maxPrice;
        if (minRating > 0) query.rating = minRating;
        if (inStockOnly) query.inStock = 'true';
        if (sortBy) query.sort = sortBy;

        const data = await fetchProducts(query);
        setProducts(data);
      } catch (err) {
        console.error('Failed fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [keyword, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('0');
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <MainLayout>
      <div className="container products-page">
        <Breadcrumb items={[{ label: 'Products Catalog' }]} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>Product Catalog</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Showing {products.length} items
            </p>
          </div>

          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SlidersHorizontal size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem 1rem', width: '180px' }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        <div className="products-layout">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Filter size={18} color="var(--primary-400)" /> Filters
              </div>
              <button onClick={handleResetFilters} style={{ fontSize: '0.8rem', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            {/* Real-time Search Filter */}
            <div className="filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Search Keywords</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Minimum Rating</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[4, 3, 2, 1].map((stars) => (
                  <label key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="rating"
                      value={stars}
                      checked={Number(minRating) === stars}
                      onChange={(e) => setMinRating(e.target.value)}
                    />
                    <div style={{ display: 'flex', color: 'var(--accent-amber)', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={14} fill="currentColor" /> {stars} Stars & Up
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="filter-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            {loading ? (
              <div className="product-grid">
                {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Products Found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your filters or search keywords.</p>
                <button onClick={handleResetFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
