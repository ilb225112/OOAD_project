import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-none rounded-[var(--radius-xl)]';
  
  const variants = {
    primary: `
      bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white
      shadow-[var(--shadow-neu-md)]
      hover:shadow-[var(--shadow-neu-hover)]
      hover:-translate-y-0.5
      active:shadow-[var(--shadow-neu-active)]
      active:translate-y-0
      neu-button-gradient
    `,
    secondary: `
      bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]
      shadow-[var(--shadow-neu-md)]
      hover:shadow-[var(--shadow-neu-hover)]
      hover:text-[var(--color-text-primary)] hover:-translate-y-0.5
      active:shadow-[var(--shadow-neu-active)]
      active:translate-y-0
      neu-button
    `,
    outline: `
      bg-[var(--color-bg-card)] text-[var(--color-accent-primary)] border-2 border-[var(--color-accent-primary)]
      shadow-[var(--shadow-neu-sm)]
      hover:shadow-[var(--shadow-neu-md)]
      hover:-translate-y-0.5
      active:shadow-[var(--shadow-neu-active)]
      active:translate-y-0
    `,
    ghost: `
      bg-transparent text-[var(--color-text-secondary)]
      hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]
      hover:shadow-[var(--shadow-neu-sm)]
      active:shadow-[var(--shadow-neu-active)]
    `,
    destructive: `
      bg-gradient-to-br from-[var(--color-error)] to-[#C0392B] text-white
      shadow-[var(--shadow-neu-md)]
      hover:shadow-[var(--shadow-neu-hover)]
      hover:-translate-y-0.5
      active:shadow-[var(--shadow-neu-active)]
      active:translate-y-0
    `,
    success: `
      bg-gradient-to-br from-[var(--color-success)] to-[#229954] text-white
      shadow-[var(--shadow-neu-md)]
      hover:shadow-[var(--shadow-neu-hover)]
      hover:-translate-y-0.5
      active:shadow-[var(--shadow-neu-active)]
      active:translate-y-0
    `,
  };
  
  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-3.5 text-lg',
    xl: 'px-12 py-4 text-xl',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

export default Button;
