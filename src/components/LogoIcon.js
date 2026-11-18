import React from 'react';

const LogoIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#ffcc00" strokeWidth="3" />
    <circle cx="12" cy="12" r="4" fill="#ffcc00" />
  </svg>
);

export default LogoIcon;
