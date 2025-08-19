import React from 'react';

const Button = ({ 
  children, 
  loading = false, 
  disabled = false, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const getButtonClasses = () => {
    let classes = 'button';
    
    classes += ` button-${variant}`;
    classes += ` button-${size}`;
    
    if (loading) classes += ' button-loading';
    if (disabled) classes += ' button-disabled';
    if (className) classes += ` ${className}`;
    
    return classes;
  };

  return (
    <button 
      className={getButtonClasses()}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="button-spinner" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
