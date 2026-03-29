import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full';
  
  const variants = {
    default: 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] shadow-[var(--shadow-neu-flat)]',
    live: 'bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white shadow-[var(--shadow-neu-sm)]',
    upcoming: 'bg-gradient-to-br from-[var(--color-info)] to-[#2980B9] text-white shadow-[var(--shadow-neu-sm)]',
    completed: 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] shadow-[var(--shadow-neu-flat)]',
    sold: 'bg-gradient-to-br from-[var(--color-error)] to-[#C0392B] text-white shadow-[var(--shadow-neu-sm)]',
    available: 'bg-gradient-to-br from-[var(--color-success)] to-[#229954] text-white shadow-[var(--shadow-neu-sm)]',
    cricket: 'bg-gradient-to-br from-[var(--color-accent-gradient-end)] to-[#CA6F1E] text-white shadow-[var(--shadow-neu-sm)]',
    antiques: 'bg-gradient-to-br from-[var(--color-warning)] to-[#D68910] text-[var(--color-bg-primary)] shadow-[var(--shadow-neu-sm)]',
    real_estate: 'bg-gradient-to-br from-[var(--color-info)] to-[#17A589] text-white shadow-[var(--shadow-neu-sm)]',
    kabaddi: 'bg-gradient-to-br from-[#EC7063] to-[#C0392B] text-white shadow-[var(--shadow-neu-sm)]',
  };
  
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
