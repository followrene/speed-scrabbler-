import React from 'react';

interface SpeedScrabblerLogoProps {
  size?: number;
  className?: string;
}

export default function SpeedScrabblerLogo({ size = 64, className = '' }: SpeedScrabblerLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Scrabble Tile Background */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="8"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
      />
      
      {/* Tile Inner */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="4"
        fill="#F5DEB3"
        stroke="#D2B48C"
        strokeWidth="1"
      />
      
      {/* Letter S - Clean and Simple */}
      <path
        d="M20 12C16 12 13 14 13 17C13 19 14 21 16 22C14 23 13 25 13 27C13 30 16 32 20 32C24 32 27 30 27 27C27 25 26 23 24 22C26 21 27 19 27 17C27 14 24 12 20 12Z"
        fill="#1E40AF"
        stroke="#1E3A8A"
        strokeWidth="1"
      />
      
      {/* Tile Shadow */}
      <rect
        x="6"
        y="6"
        width="56"
        height="56"
        rx="8"
        fill="rgba(0,0,0,0.1)"
        transform="translate(2, 2)"
      />
    </svg>
  );
} 