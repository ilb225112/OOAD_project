import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
            rounded-[var(--radius-lg)]
            shadow-[var(--shadow-neu-inset-md)]
            focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-12' : ''}
            ${error ? 'ring-2 ring-[var(--color-error)]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-[var(--color-error)] font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
