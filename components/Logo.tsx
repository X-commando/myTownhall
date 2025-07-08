'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dark' | 'light';
  animated?: boolean;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ 
  className = '', 
  size = 'md', 
  variant = 'default',
  animated = false,
  showText = false,
  textClassName = ''
}: LogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80
  };

  const dimension = sizeMap[size];

  // Apply filters based on variant
  const getFilterClass = () => {
    switch (variant) {
      case 'dark':
        return 'brightness-0 invert'; // Makes logo white for dark backgrounds
      case 'light':
        return 'brightness-0'; // Makes logo black for light backgrounds
      default:
        return ''; // Original colors
    }
  };

  const animationClass = animated ? 'transition-all duration-300 hover:scale-110' : '';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${animationClass}`}>
        <Image
          src="/townhallLogo.png"
          alt="MyTownhall Logo"
          width={dimension}
          height={dimension}
          className={`${getFilterClass()} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          onLoad={() => setIsLoaded(true)}
          priority={size === 'lg' || size === 'xl'}
        />
        {!isLoaded && (
          <div 
            className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg"
            style={{ width: dimension, height: dimension }}
          />
        )}
      </div>
      {showText && (
        <span className={`font-light ${textClassName}`}>
          My<span className="font-normal">Townhall</span>
        </span>
      )}
    </div>
  );
}