'use client';

import React from 'react';
import styles from './DefaultAvatar.module.css';

function DefaultAvatar({ size = 40, className = '', alt = 'User' }) {
  const iconSize = size * 0.6; // Make icon larger relative to container
  
  return (
    <div 
      className={`${styles.defaultAvatar} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Head - larger circle */}
        <circle cx="12" cy="7" r="4" fill="white" stroke="white"></circle>
        {/* Body - rounded shoulders */}
        <path d="M12 13c-4 0-7 2-7 6v1h14v-1c0-4-3-6-7-6z" fill="white" stroke="white"></path>
      </svg>
    </div>
  );
}

export default DefaultAvatar;
