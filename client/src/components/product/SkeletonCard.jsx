import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="product-card">
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1' }} />
      <div className="card-body" style={{ gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton" style={{ width: '90%', height: '20px' }} />
        <div className="skeleton" style={{ width: '60%', height: '16px' }} />
        <div className="skeleton" style={{ width: '50%', height: '24px', marginTop: '0.5rem' }} />
      </div>
      <div className="card-footer">
        <div className="skeleton" style={{ width: '100%', height: '36px' }} />
      </div>
    </div>
  );
};
