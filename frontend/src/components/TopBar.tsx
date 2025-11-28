import { motion } from 'framer-motion';
import { Menu, Wallet, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TopBarProps {
  walletAddress?: string;
  onWalletConnect?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ walletAddress, onWalletConnect }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/budget', label: 'Budget' },
    { path: '/agents', label: 'Agents' },
    { path: '/insights', label: 'Insights' },
    { path: '/settings', label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(26, 32, 41, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              style={{
                width: '40px',
                height: '40px',
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              F
            </motion.div>
            <span style={{ fontSize: '20px', fontWeight: '600' }}>FinanceAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive(item.path) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isActive(item.path) ? 'var(--color-surface)' : 'transparent',
                  position: 'relative',
                }}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '16px',
                      right: '16px',
                      height: '2px',
                      background: 'var(--color-primary)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {walletAddress ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-accent-muted)',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: '1px solid var(--color-accent)',
                }}
              >
                <Wallet size={16} style={{ display: 'inline', marginRight: '8px' }} />
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onWalletConnect}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Wallet size={16} />
                Connect Wallet
              </motion.button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              paddingBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
            className="mobile-menu"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive(item.path) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isActive(item.path) ? 'var(--color-surface)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </motion.nav>
  );
};
