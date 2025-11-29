import React from 'react';
import { motion } from 'framer-motion';

interface FintechDecorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'shield' | 'bars' | 'coins' | 'minimal';
  size?: number;
}

export const FintechDecor: React.FC<FintechDecorProps> = ({ 
  position = 'top-right', 
  variant = 'minimal',
  size = 40 
}) => {
  const positionStyles = {
    'top-left': { top: '-8px', left: '-8px' },
    'top-right': { top: '-8px', right: '-8px' },
    'bottom-left': { bottom: '-8px', left: '-8px' },
    'bottom-right': { bottom: '-8px', right: '-8px' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {variant === 'shield' && <ShieldIcon size={size} />}
      {variant === 'bars' && <BarsIcon size={size} />}
      {variant === 'coins' && <CoinsIcon size={size} />}
      {variant === 'minimal' && <MinimalIcon size={size} />}
    </motion.div>
  );
};

// Shield Icon - Trust & Security
const ShieldIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c5f7c" stopOpacity="0.15" />
        <stop offset="50%" stopColor="#4a9fb8" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#8ba8b3" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    <path
      d="M20 4L8 10V18C8 26 14 32 20 36C26 32 32 26 32 18V10L20 4Z"
      fill="url(#shieldGrad)"
      stroke="#4a9fb8"
      strokeWidth="0.5"
      opacity="0.6"
    />
    <path
      d="M20 10L14 13V18C14 22 17 25 20 27C23 25 26 22 26 18V13L20 10Z"
      fill="none"
      stroke="#8ba8b3"
      strokeWidth="0.5"
      opacity="0.4"
    />
  </svg>
);

// Bars Icon - Growth & Analytics
const BarsIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="barsGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#2c5f7c" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#4a9fb8" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <rect x="8" y="24" width="6" height="12" rx="1" fill="url(#barsGrad)" opacity="0.5" />
    <rect x="17" y="18" width="6" height="18" rx="1" fill="url(#barsGrad)" opacity="0.6" />
    <rect x="26" y="12" width="6" height="24" rx="1" fill="url(#barsGrad)" opacity="0.7" />
    <path
      d="M11 24L20 18L29 12"
      stroke="#4a9fb8"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

// Coins Icon - Savings & Money
const CoinsIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="coinGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c5f7c" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#8ba8b3" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="coinGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a9fb8" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#8ba8b3" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <circle cx="15" cy="18" r="10" fill="url(#coinGrad1)" stroke="#4a9fb8" strokeWidth="0.5" opacity="0.6" />
    <circle cx="15" cy="18" r="6" fill="none" stroke="#8ba8b3" strokeWidth="0.5" opacity="0.3" />
    <circle cx="25" cy="24" r="10" fill="url(#coinGrad2)" stroke="#4a9fb8" strokeWidth="0.5" opacity="0.7" />
    <circle cx="25" cy="24" r="6" fill="none" stroke="#8ba8b3" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

// Minimal Icon - Clean geometric pattern
const MinimalIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="minimalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c5f7c" stopOpacity="0.08" />
        <stop offset="50%" stopColor="#4a9fb8" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#8ba8b3" stopOpacity="0.06" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="12" height="12" rx="2" fill="url(#minimalGrad)" opacity="0.5" />
    <rect x="24" y="10" width="6" height="6" rx="1" fill="url(#minimalGrad)" opacity="0.6" />
    <rect x="10" y="24" width="6" height="6" rx="1" fill="url(#minimalGrad)" opacity="0.6" />
    <circle cx="27" cy="27" r="5" fill="url(#minimalGrad)" opacity="0.5" />
    <path d="M14 14L18 18M18 14L14 18" stroke="#4a9fb8" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

// Corner Accent Component
export const CornerAccent: React.FC<{ corner?: 'tl' | 'tr' | 'bl' | 'br' }> = ({ corner = 'tr' }) => {
  const cornerStyles = {
    tl: { top: 0, left: 0, transform: 'rotate(0deg)' },
    tr: { top: 0, right: 0, transform: 'rotate(90deg)' },
    br: { bottom: 0, right: 0, transform: 'rotate(180deg)' },
    bl: { bottom: 0, left: 0, transform: 'rotate(270deg)' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...cornerStyles[corner],
        width: '24px',
        height: '24px',
        pointerEvents: 'none',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={`corner-${corner}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a9fb8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8ba8b3" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0 0L24 0L24 2L2 2L2 24L0 24Z"
          fill={`url(#corner-${corner})`}
        />
        <rect x="4" y="4" width="2" height="2" rx="0.5" fill="#4a9fb8" opacity="0.4" />
      </svg>
    </div>
  );
};
