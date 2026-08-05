import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProductCard } from '../../components/product/ProductCard';
import { fetchProductById, fetchProducts, createProductReview } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ToastContext } from '../../context/ToastContext';
import { AuthContext } from '../../context/AuthContext';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Send } from 'lucide-react';
import '../../styles/products.css';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewsList, setReviewsList] = useState([]);

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const prod = await fetchProductById(id);
        setProduct(prod);
        if (prod.images && prod.images.length > 0) {
          setActiveImage(prod.images[0]);
        }

        // Fetch related products in same category
        const allProds = await fetchProducts({ category: prod.category });
        setRelatedProducts(allProds.filter((p) => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading || !product) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h2>Loading product details...</h2>
        </div>
      </MainLayout>
    );
  }

  const discount = product.discount || 0;
  const originalPrice = product.price;
  const discountedPrice = originalPrice * (1 - discount / 100);
  const isWishlisted = isInWishlist(product._id);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    addToast(`Added ${quantity} x "${product.name}" to cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to leave a product review.', 'info');
      navigate('/login');
      return;
    }

    try {
      await createProductReview(id, { rating, comment });
      addToast('Review submitted successfully!', 'success');
      setComment('');
      // Reload product data
      const updated = await fetchProductById(id);
      setProduct(updated);
    } catch (err) {
      addToast(err.message || 'Failed submitting review', 'error');
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Breadcrumb items={[{ label: 'Products', link: '/products' }, { label: product.name }]} />

        {/* Product Detail Grid */}
        <div className="product-detail-layout">
          {/* Gallery */}
          <div className="detail-gallery">
            <img src={activeImage} alt={product.name} className="main-image" />
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-row">
                {product.images.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Thumbnail ${i}`}
                    className={`thumb-img ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Summary & Buy Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span className="category-tag">{product.category}</span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)' }}>
                <Star size={16} fill="currentColor" />
                <span style={{ fontWeight: 700 }}>{product.rating || 4.5}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount || 0} reviews)</span>
              </div>
              <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
                {inStock ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Brand: {product.brand}</span>
            </div>

            {/* Pricing Box */}
            <div style={{ padding: '1.25rem', background: 'rgba(17, 24, 39, 0.6)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                  ${discountedPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="badge badge-danger">{discount}% OFF</span>
                  </>
                )}
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{product.description}</p>

            {/* Quantity Selector & Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0.6rem 1rem', fontSize: '1.1rem', color: 'var(--text-main)' }}
                >
                  -
                </button>
                <span style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  style={{ padding: '0.6rem 1rem', fontSize: '1.1rem', color: 'var(--text-main)' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
                disabled={!inStock}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.85rem', background: 'var(--accent-emerald)', color: '#fff', border: 'none' }}
                disabled={!inStock}
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`icon-badge-btn ${isWishlisted ? 'active' : ''}`}
                style={{ width: '48px', height: '48px' }}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#f43f5e' : 'none'} color={isWishlisted ? '#f43f5e' : '#fff'} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Technical Specifications</h3>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <tbody>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-muted)', width: '30%' }}>{key}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews & Ratings Form Section */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Customer Reviews ({product.reviewsCount})</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
            {/* Submit Review */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Write a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Rating</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-input">
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Good)</option>
                    <option value={2}>⭐⭐ (2/5 Average)</option>
                    <option value={1}>⭐ (1/5 Poor)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Comment / Feedback</label>
                  <textarea
                    rows={4}
                    placeholder="Share your experience with this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  <Send size={16} /> Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Average Rating: <strong>{product.rating} / 5.0</strong> based on verified reviews.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>Alex Johnson</span>
                    <div style={{ display: 'flex', color: 'var(--accent-amber)', gap: '0.1rem' }}>
                      {Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    "Outstanding build quality! Delivery was fast and the product performance exceeded my expectations."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Related Products</h3>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
