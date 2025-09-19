import React from 'react';

interface SimpleIconProps {
  size?: number;
  className?: string;
}

export default function SimpleIcon({ size = 64, className = '' }: SimpleIconProps) {
  return (
    <img
      src="/speed-scrabbler-logo.png"
      alt="Speed Scrabbler Logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
