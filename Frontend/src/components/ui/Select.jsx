import React from 'react';

const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  error,
  icon,
  placeholder = 'Select an option',
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#a4b0be] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747d8c] pointer-events-none">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-3
            bg-[var(--color-bg-inset)] text-[var(--color-text-primary)]
            rounded-[16px]
            shadow-[inset_5px_5px_10px_rgba(0,0,0,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.03)]
            focus:outline-none focus:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.03),0_0_0_2px_rgba(255,99,72,0.5)]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
            ${icon ? 'pl-12' : ''}
            ${error ? 'shadow-[inset_5px_5px_10px_rgba(0,0,0,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.03),0_0_0_2px_rgba(252,92,101,0.5)]' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747d8c] pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-[#fc5c65] font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;
