import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  flat = false,
  ...props 
}) => {
  const baseStyles = 'rounded-[var(--radius-2xl)] transition-all duration-300 bg-[var(--color-bg-card)]';
  const shadowStyles = flat 
    ? 'shadow-[var(--shadow-neu-flat)]'
    : 'shadow-[var(--shadow-neu-md)]';
  const hoverStyles = hover 
    ? 'hover:-translate-y-1 hover:shadow-[var(--shadow-neu-hover)] cursor-pointer' 
    : '';
  
  return (
    <div 
      className={`${baseStyles} ${shadowStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-[var(--color-bg-elevated)] ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-[var(--color-bg-elevated)] ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
