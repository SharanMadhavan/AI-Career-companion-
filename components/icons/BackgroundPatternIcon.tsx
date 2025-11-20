
import React from 'react';

const BackgroundPatternIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="a"
        patternUnits="userSpaceOnUse"
        width="20"
        height="20"
        patternTransform="scale(3) rotate(0)"
      >
        <rect x="0" y="0" width="100%" height="100%" fill="none"></rect>
        <path
          d="M10-5V5M10 15v10M-5 10H5M15 10h10"
          strokeWidth="0.5"
          stroke="currentColor"
          fill="none"
        ></path>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#a)"></rect>
  </svg>
);

export default BackgroundPatternIcon;