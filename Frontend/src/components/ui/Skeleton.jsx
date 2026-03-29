import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular', width, height }) => {
  const baseStyles = 'animate-pulse bg-[var(--color-bg-elevated)]';
  
  const variants = {
    rectangular: 'rounded-[20px]',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };
  
  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%')
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

export const SkeletonCard = () => (
  <div className="p-6 bg-[#252d32] rounded-3xl shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.03)]">
    <Skeleton variant="rectangular" height="200px" className="mb-4" />
    <Skeleton variant="text" className="mb-2" width="60%" />
    <Skeleton variant="text" className="mb-4" width="80%" />
    <div className="flex gap-2">
      <Skeleton variant="rectangular" height="40px" width="100px" />
      <Skeleton variant="rectangular" height="40px" width="100px" />
    </div>
  </div>
);

export const SkeletonAuctionCard = () => (
  <div className="overflow-hidden rounded-3xl bg-[#252d32] shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.03)]">
    <Skeleton variant="rectangular" height="192px" />
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <Skeleton variant="rectangular" height="24px" width="60px" />
        <Skeleton variant="rectangular" height="24px" width="80px" />
      </div>
      <Skeleton variant="text" className="mb-2" width="80%" />
      <Skeleton variant="text" className="mb-4" width="60%" />
      <Skeleton variant="rectangular" height="40px" />
    </div>
  </div>
);

export default Skeleton;
