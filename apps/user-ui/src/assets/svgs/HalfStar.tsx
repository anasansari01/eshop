import React from 'react';

const HalfStar = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="w-5 h-5"
  >
    <defs>
      <linearGradient id="halfGrad">
        <stop offset="50%" stopColor="#FFC107" />
        <stop offset="50%" stopColor="#E0E0E0" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path 
      fill="url(#halfGrad)" 
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
    />
  </svg>
);

export default HalfStar;