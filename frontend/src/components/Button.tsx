import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  type = 'button',
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const variants: Record<string, any> = {
    primary: {
      background: 'var(--color-primary)',
      color: '#fff',
    },
    secondary: {
      background: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
    },
    accent: {
      background: 'var(--color-accent)',
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
    },
  };

  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: '13px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '14px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '16px',
    },
  };

  const hoverVariants: Record<string, any> = {
    primary: { background: 'var(--color-primary-hover)', scale: 1.02 },
    secondary: { background: 'var(--color-surface-hover)', scale: 1.02 },
    accent: { background: 'var(--color-accent-hover)', scale: 1.02 },
    outline: { borderColor: 'var(--color-border-hover)', scale: 1.02 },
    ghost: { background: 'rgba(255, 255, 255, 0.05)' },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
      }}
      whileHover={disabled ? {} : hoverVariants[variant]}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
    </motion.button>
  );
};
