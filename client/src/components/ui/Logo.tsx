import React from 'react';
import { Link } from 'wouter';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const fontSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <Link href="/">
      <a className={`flex items-center ${className}`}>
        <h1 className={`text-primary font-montserrat font-bold ${fontSizes[size]} tracking-wider`}>
          STREAMPE
        </h1>
        <svg 
          className="ml-1 text-primary" 
          width={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
          height={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </a>
    </Link>
  );
};

export default Logo;
