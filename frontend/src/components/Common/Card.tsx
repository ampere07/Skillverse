import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  glass = false
}) => {
  const baseClasses = 'rounded-xl shadow-card transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-1' : '';
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  const backgroundClasses = glass ? 'glass' : 'bg-white';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${backgroundClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;