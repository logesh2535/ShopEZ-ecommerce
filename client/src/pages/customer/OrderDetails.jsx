import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { fetchOrderById } from '../../services/orderService';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  KeyRound,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  Calendar,
  Zap,
  Package,
  Navigation,
  Sparkles,
} from 'lucide-react';

const FlipkartTrackingStepper = ({ status, timeline, deliveryType }) => {
  const stepsOrder = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepStatus = (stepKey) => {
    if (status === 'Cancelled') return 'cancelled';
    const statusIndex = stepsOrder.indexOf(status === 'Pending' ? 'Placed' : status);
    const stepIndex = stepsOrder.indexOf(stepKey);

    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} color="#eab308" /> Express Delivery Tracker
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Live Delivery Progress</h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Delivery Method</span>
          <div style={{ fontWeight: 700, color: 'var(--primary-400)', fontSize: '0.95rem' }}>
            {deliveryType || 'Standard Express'}
          </div>
        </div>
      </div>

      {/* Stepper Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', position: 'relative', textAlign: 'center' }}>
        {stepsOrder.map((stepKey, idx) => {
          const stepState = getStepStatus(stepKey);
          const isCompleted = stepState === 'completed' || stepState === 'active';
          const isActive = stepState === 'active';

          const timelineItem = timeline?.find((t) => t.stepKey === stepKey);

          return (
            <div key={stepKey} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              {/* Icon Circle */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : isCompleted
                    ? 'var(--primary-600)'
                    : 'rgba(30, 41, 59, 0.8)',
                  color: '#fff',
                  border: isActive
                    ? '3px solid #6ee7b7'
                    : isCompleted
                    ? '2px solid var(--primary-400)'
                    : '2px solid var(--border-light)',
                  boxShadow: isActive ? '0 0 15px rgba(16, 185, 129, 0.6)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {stepKey === 'Placed' && <ShoppingBagIcon />}
                {stepKey === 'Processing' && <Package size={20} />}
                {stepKey === 'Shipped' && <Truck size={20} />}
                {stepKey === 'Out for Delivery' && <Navigation size={20} />}
                {stepKey === 'Delivered' && <CheckCircle2 size={20} />}
              </div>

              {/* Title & Status */}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: isActive ? 800 : isCompleted ? 700 : 500, color: isActive ? '#34d399' : isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {stepKey === 'Processing' ? 'Packed' : stepKey}
                </div>
                {timelineItem?.timestamp && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {new Date(timelineItem.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !order) {
    return (
      <CustomerLayout title="Order Details">
        <p style={{ color: 'var(--text-muted)' }}>Loading delivery schedule...</p>
      </CustomerLayout>
    );
  }

  const deliveryDateFormatted = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    : 'Estimated in 2-3 Business Days';

  return (
    <CustomerLayout title={`Order Details: ${order.orderId || order._id}`}>
      {/* Visual Stepper */}
      <FlipkartTrackingStepper
        status={order.status}
        timeline={order.trackingTimeline}
        deliveryType={order.deliveryType}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        {/* Left Column: Flipkart Delivery OTP & Executive Card + Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Flipkart Security Delivery OTP Badge */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
                  <ShieldCheck size={18} /> Secure Open Box Delivery OTP
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Share this 4-digit security OTP with your delivery executive upon parcel handover.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.5)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #34d399' }}>
                <KeyRound size={20} color="#34d399" />
                <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '4px', color: '#fff' }}>
                  {order.deliveryOTP || '4829'}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Delivery Executive Card */}
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-400)' }}>
              <UserCheck size={18} /> Assigned Delivery Executive
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivery Partner</div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {order.deliveryExecutive?.name || 'Ramesh Kumar'}
                </strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Agent ID: {order.deliveryExecutive?.agentId || 'AGNT-7741'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle & Courier</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                  {order.courierName || 'ShopEZ Express'} ({order.deliveryExecutive?.vehicleNo || 'EZ-EXP-992'})
                </div>
                <a
                  href={`tel:${order.deliveryExecutive?.phone || '+15550199'}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    color: 'var(--primary-400)',
                    marginTop: '6px',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  <PhoneCall size={14} /> Call Agent ({order.deliveryExecutive?.phone || '+1 555-0199'})
                </a>
              </div>
            </div>
          </div>

          {/* Ordered items */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Purchased Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.products?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.name}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} × ${item.price?.toFixed(2)}
                    </div>
                  </div>
                  <strong style={{ fontSize: '1.05rem' }}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Schedule & Address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Delivery Schedule Details */}
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-400)' }}>
              <Calendar size={18} /> Delivery Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scheduled Delivery Date</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-amber)', marginTop: '2px' }}>
                  {deliveryDateFormatted}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time Slot Window</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={15} color="var(--primary-400)" /> {order.deliveryTimeSlot || 'Morning Slot (9:00 AM - 1:00 PM)'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tracking Number</span>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-300)', marginTop: '2px' }}>
                  {order.trackingNumber || 'SEZLOG882190'}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary-400)" /> Delivery Address
            </h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>{order.shippingAddress?.fullName}</strong><br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
              Phone: {order.shippingAddress?.phone}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Payment Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method</span>
                <strong>{order.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                <span>${order.taxAmount?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                <span>${order.shippingFee?.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary-400)' }}>${order.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
