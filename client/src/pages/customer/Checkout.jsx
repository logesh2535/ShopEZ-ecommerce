import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { placeOrder } from '../../services/orderService';
import { ShieldCheck, CreditCard, DollarSign, Truck, Lock, Calendar, Clock, Zap, PackageCheck } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, subtotalPrice, discountTotal, taxAmount, clearCart } = useContext(CartContext);
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
  const [deliveryType, setDeliveryType] = useState('Express (Next Day)');
  
  // Dates for scheduled delivery
  const today = new Date();
  const tomorrowStr = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfterStr = new Date(today.getTime() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
  const inThreeDaysStr = new Date(today.getTime() + 72 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState('Morning Slot (9:00 AM - 1:00 PM)');
  const [loading, setLoading] = useState(false);

  // Dynamic Shipping Fee based on delivery type selection
  const calculatedShippingFee = deliveryType === 'Express (Next Day)' ? 4.99 : 0;
  const calculatedGrandTotal = subtotalPrice + taxAmount + calculatedShippingFee;

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
        shippingFee: calculatedShippingFee,
        grandTotal: calculatedGrandTotal,
        deliveryType,
        deliveryDate: selectedDate,
        deliveryTimeSlot: selectedSlot,
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

        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)', fontWeight: 800 }}>
          Checkout & Flipkart Delivery Options
        </h1>

        <form onSubmit={handlePlaceOrderSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Form Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping Address */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-400)' }}>
                  <Truck size={22} /> 1. Shipping Address
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
                    <label>Phone Number (Required for Delivery OTP)</label>
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
                    <label>Pincode / Zip Code</label>
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

              {/* Flipkart-Style Delivery Schedule & Time Slot Selection */}
              <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <Calendar size={22} color="var(--primary-400)" /> 2. Delivery Speed & Time Slot Schedule
                  </h3>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    <ShieldCheck size={12} style={{ marginRight: '4px' }} /> Verified Delivery Slots
                  </span>
                </div>

                {/* Delivery Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {/* Option 1: Express Next Day */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-md)',
                      background: deliveryType === 'Express (Next Day)' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: deliveryType === 'Express (Next Day)' ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="Express (Next Day)"
                        checked={deliveryType === 'Express (Next Day)'}
                        onChange={() => setDeliveryType('Express (Next Day)')}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Zap size={16} color="#eab308" /> Flipkart Express (Next-Day Delivery)
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Guaranteed Delivery by Tomorrow morning • Open Box Inspection included
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-amber)', fontSize: '1.1rem' }}>$4.99</span>
                  </label>

                  {/* Option 2: Scheduled Slot */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-md)',
                      background: deliveryType === 'Scheduled Slot' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: deliveryType === 'Scheduled Slot' ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="Scheduled Slot"
                        checked={deliveryType === 'Scheduled Slot'}
                        onChange={() => setDeliveryType('Scheduled Slot')}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={16} color="var(--primary-400)" /> Preferred Time Slot Delivery
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Choose your exact delivery date & preferred time window
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1.05rem' }}>FREE</span>
                  </label>

                  {/* Option 3: Standard Free */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-md)',
                      background: deliveryType === 'Standard' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: deliveryType === 'Standard' ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="Standard"
                        checked={deliveryType === 'Standard'}
                        onChange={() => setDeliveryType('Standard')}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <PackageCheck size={16} color="var(--text-muted)" /> Standard FREE Delivery
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Delivered in 3 - 5 business days
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1.05rem' }}>FREE</span>
                  </label>
                </div>

                {/* Sub-section: Select Date & Time Slot if Scheduled Slot is selected */}
                {deliveryType === 'Scheduled Slot' && (
                  <div style={{ padding: '1.25rem', background: 'rgba(17, 24, 39, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary-300)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={16} /> Choose Preferred Date & Time Window
                    </h4>

                    {/* Date Selector Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {[
                        { label: 'Tomorrow', date: tomorrowStr },
                        { label: 'Day After', date: dayAfterStr },
                        { label: 'In 3 Days', date: inThreeDaysStr },
                      ].map((item) => (
                        <button
                          key={item.date}
                          type="button"
                          onClick={() => setSelectedDate(item.date)}
                          style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: selectedDate === item.date ? '2px solid var(--primary-400)' : '1px solid var(--border-light)',
                            background: selectedDate === item.date ? 'rgba(139, 92, 246, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                            color: selectedDate === item.date ? '#fff' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            textAlign: 'center',
                          }}
                        >
                          <div>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>{item.date}</div>
                        </button>
                      ))}
                    </div>

                    {/* Time Slot Buttons */}
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Select Preferred Time Slot:</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {[
                        'Morning Slot (8:00 AM - 12:00 PM)',
                        'Afternoon Slot (12:00 PM - 4:00 PM)',
                        'Evening Slot (4:00 PM - 8:00 PM)',
                      ].map((slot) => (
                        <label
                          key={slot}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: selectedSlot === slot ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                            border: `1px solid ${selectedSlot === slot ? 'var(--accent-emerald)' : 'var(--border-light)'}`,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                          }}
                        >
                          <input
                            type="radio"
                            name="timeSlot"
                            value={slot}
                            checked={selectedSlot === slot}
                            onChange={() => setSelectedSlot(slot)}
                          />
                          <span style={{ fontWeight: selectedSlot === slot ? 700 : 400 }}>{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)' }}>
                  <CreditCard size={22} /> 3. Select Payment Method
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery', 'UPI / NetBanking'].map((method) => (
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
            <div className="glass-card" style={{ padding: '2rem', sticky: 'top', top: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                Order Summary
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
                  <span style={{ color: 'var(--text-muted)' }}>Shipping Fee ({deliveryType})</span>
                  <span>{calculatedShippingFee === 0 ? <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong> : `$${calculatedShippingFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-400)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <span>Grand Total</span>
                  <span>${calculatedGrandTotal.toFixed(2)}</span>
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
