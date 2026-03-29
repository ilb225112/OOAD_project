import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  actionLabel,
  className = '' 
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="text-[var(--color-text-muted)]">
        {icon || (
          <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h3>
        {description && <p className="text-[var(--color-text-secondary)] mb-6">{description}</p>}
        {action && actionLabel && (
          <Button variant="primary" onClick={action}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
