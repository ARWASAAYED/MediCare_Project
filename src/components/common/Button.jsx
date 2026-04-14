import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'lg', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[oklch(0.77_0.18_186.55)] text-white hover:opacity-90 shadow-lg hover:shadow-xl focus:ring-brand-red',
    outline: 'bg-white border-2 border-black  hover:bg-white hover:text-[oklch(0.77_0.18_186.55)] hover:border-gray-400 focus:ring-[oklch(0.77_0.18_186.55)]',
    white: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-gray-200',
    ghost: 'text-oklch(0.77_0.18_186.55) hover:bg-brand-red/10',
  };

  const sizes = {
    lg: 'px-8 py-4 text-lg',
    md: 'px-6 py-3 text-base',
    sm: 'px-4 py-2 text-sm',
  };

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.lg}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
