import { motion } from 'framer-motion';
import React from 'react';
import { CornerAccent } from './FintechDecor';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  decorative?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
  decorative = false,
}) => {
  const paddingMap = {
    none: '0',
    sm: '16px',
    md: '24px',
    lg: '32px',
  };

  return (
    <motion.div
      onClick={onClick}
      style={{
        background: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        padding: paddingMap[padding],
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
      }}
      className={className}
      whileHover={hover ? { 
        borderColor: 'var(--color-border-hover)',
        y: -4,
        transition: { duration: 0.3 }
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {decorative && (
        <>
          <CornerAccent corner="tr" />
          <CornerAccent corner="bl" />
        </>
      )}
      {children}
    </motion.div>
  );
};
