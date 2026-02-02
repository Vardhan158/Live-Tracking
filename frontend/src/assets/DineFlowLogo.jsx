// Simple fallback logo for DineFlow HMS
// You can replace this with your own SVG or image-based logo component
import React from 'react';

export default function DineFlowLogo({ size = 38, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="19" cy="19" r="19" fill="url(#paint0_linear)" />
      <path
        d="M12 26c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="15" r="4" fill="#fff" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB300" />
          <stop offset="1" stopColor="#FF6F00" />
        </linearGradient>
      </defs>
    </svg>
  );
}
