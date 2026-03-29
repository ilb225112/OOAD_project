import React from 'react';
import Card from './Card';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    blue: 'from-[var(--color-info)] to-[#2980B9]',
    emerald: 'from-[var(--color-success)] to-[#229954]',
    purple: 'from-[#9B59B6] to-[#8E44AD]',
    amber: 'from-[var(--color-warning)] to-[#D68910]',
    pink: 'from-[#EC7063] to-[#C0392B]',
  };
  
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-[var(--color-bg-elevated)] rounded w-3/4"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card hover className="p-6 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">{title}</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
              {trend === 'up' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-[var(--radius-xl)] bg-gradient-to-br ${colorClasses[color]} shadow-[var(--shadow-neu-md)] group-hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
