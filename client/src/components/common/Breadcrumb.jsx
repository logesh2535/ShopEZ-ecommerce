import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0 2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
      <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={14} />
          {item.link ? (
            <Link to={item.link} style={{ color: 'var(--text-muted)' }}>{item.label}</Link>
          ) : (
            <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
