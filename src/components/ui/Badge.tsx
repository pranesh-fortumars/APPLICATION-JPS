import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-sm whitespace-nowrap";
  
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-primary",
    outline: "bg-transparent border border-black/10 text-primary",
    danger: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};
