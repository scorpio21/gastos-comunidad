import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = '#0D9488',
  className = '' 
}) => {
  // Convert hex color to RGB for transparency
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color);
  const style = {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
    color: color,
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;