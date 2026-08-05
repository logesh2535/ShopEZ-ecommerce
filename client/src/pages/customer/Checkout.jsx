import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { placeOrder } from '../../services/orderService';
import { ShieldCheck, CreditCard, DollarSign, Truck, Lock } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, subtotalPrice, discountTotal, taxAmount, shippingFee, grandTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h2>Your cart is empty. Add products before checking out.</h2>
        </div>
      </MainLayout>
    );
  }

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      addToast('Please login or register to place your order.', 'info');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderProducts = cartItems.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price * (1 - (item.product.discount || 0) / 100),
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      const createdOrder = await placeOrder({
        products: orderProducts,
        shippingAddress,
        paymentMethod,
        totalAmount: subtotalPrice,
        discountAmount: discountTotal,
        taxAmount,
        shippingFee,
        grandTotal,
      });

      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err) {
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        <Breadcrumb items={[{ label: 'Cart', link: '/cart' }, { label: 'Checkout' }]} />

        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Checkout & Shipping</h1>

        <form onSubmit={handlePlaceOrderSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Form Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping Address */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} color="var(--primary-400)" /> Shipping Address
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} color="var(--accent-emerald)" /> Select Payment Method
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                    <label
                      key={method}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: paymentMethod === method ? 'rgba(139, 92, 246, 0.15)' : 'rgba(17, 24, 39, 0.6)',
                        border: `1px solid ${paymentMethod === method ? 'var(--primary-500)' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span style={{ fontWeight: 600 }}>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Place Order */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                Order Preview
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                {cartItems.map(({ product, quantity }) => {
                  const effectivePrice = product.price * (1 - (product.discount || 0) / 100);
                  return (
                    <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-main)', maxWidth: '200px' }}>
                        {product.name} (x{quantity})
                      </span>
                      <span style={{ fontWeight: 700 }}>${(effectivePrice * quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span>${subtotalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tax (8%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-400)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
                disabled={loading}
              >
                {loading ? 'Processing Order...' : 'Place Order Now'} <Lock size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
