import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { CartContext } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotalPrice,
    discountTotal,
    taxAmount,
    shippingFee,
    grandTotal,
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '4rem 0 6rem', textAlign: 'center' }}>
          <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
          <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
            <ShoppingBag size={56} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Look like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn-primary">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Your Shopping Cart ({cartItems.length} items)</h1>
          <button onClick={clearCart} className="btn-danger" style={{ fontSize: '0.85rem' }}>
            Clear Entire Cart
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }}>
          {/* Items Table */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            {cartItems.map(({ product, quantity }) => {
              const effectivePrice = product.price * (1 - (product.discount || 0) / 100);
              const lineTotal = effectivePrice * quantity;

              return (
                <div
                  key={product._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 120px 100px 40px',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '1rem 0',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <img
                    src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                    alt={product.name}
                    style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />

                  <div>
                    <Link to={`/products/${product._id}`} style={{ fontWeight: 600, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Category: {product.category}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary-400)', fontWeight: 700, marginTop: '0.25rem' }}>
                      {formatPrice(effectivePrice)} {product.discount > 0 && <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{formatPrice(product.price)}</span>}
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      style={{ padding: '0.35rem 0.6rem', color: 'var(--text-main)' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.35rem 0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      style={{ padding: '0.35rem 0.6rem', color: 'var(--text-main)' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {formatPrice(lineTotal)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    style={{ color: 'var(--accent-rose)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotalPrice)}</span>
              </div>

              {discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                  <span>Discount Saved</span>
                  <span>-{formatPrice(discountTotal)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong> : formatPrice(shippingFee)}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary-400)' }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="var(--accent-emerald)" /> Guaranteed 256-Bit SSL Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
