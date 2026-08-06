import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ToastContext } from '../../context/ToastContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);

  const discount = product.discount || 0;
  const originalPrice = product.price;
  const discountedPrice = originalPrice * (1 - discount / 100);
  const isWishlisted = isInWishlist(product._id);
  const inStock = product.stock > 0;

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600');

  const secondaryImage = product.images && product.images.length > 1
    ? product.images[1]
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inStock) return;
    addToCart(product, 1);
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    addToast(
      isWishlisted
        ? `Removed "${product.name}" from wishlist.`
        : `Added "${product.name}" to wishlist!`,
      'info'
    );
  };

  return (
    <div className="product-card">
      <div className="card-media">
        <img
          src={mainImage}
          alt={product.name}
          className={`card-img-primary ${secondaryImage ? 'has-secondary' : ''}`}
          loading="lazy"
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate angle`}
            className="card-img-secondary"
            loading="lazy"
          />
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="badge badge-danger" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Toggle Overlay Button */}
        <button
          className={`wishlist-btn-overlay ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#f43f5e' : 'none'} color={isWishlisted ? '#f43f5e' : '#fff'} />
        </button>
      </div>

      <div className="card-body">
        <span className="category-tag">{product.category}</span>
        <Link to={`/products/${product._id}`} className="product-title">
          {product.name}
        </Link>

        {/* Rating & Stock Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)' }}>
            <Star size={14} fill="currentColor" />
            <span style={{ fontWeight: 700 }}>{product.rating || 4.5}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount || 0})</span>
          </div>

          <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
            {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        {/* Price Row */}
        <div className="price-row">
          <span className="current-price">${discountedPrice.toFixed(2)}</span>
          {discount > 0 && <span className="old-price">${originalPrice.toFixed(2)}</span>}
        </div>
      </div>

      <div className="card-footer">
        <Link to={`/products/${product._id}`} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>
          <Eye size={16} /> Details
        </Link>

        <button
          onClick={handleAddToCart}
          className="btn-primary"
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
          disabled={!inStock}
        >
          <ShoppingBag size={16} /> Add
        </button>
      </div>
    </div>
  );
};
