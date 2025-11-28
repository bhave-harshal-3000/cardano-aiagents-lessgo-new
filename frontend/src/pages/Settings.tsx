import { motion } from 'framer-motion';
import { User, Wallet, Zap, Shield, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';

export const Settings: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [hydraEnabled, setHydraEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    shareSpending: true,
    shareIncome: false,
    shareBudget: true,
    shareTransactions: true,
  });

  const walletAddress = walletConnected ? 'addr1qx2kd28nq8s...7j8a9c4h6k' : null;

  return (
    <AnimatedPage>
      <TopBar walletAddress={walletAddress || undefined} />
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            Manage your profile, wallet, and preferences
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                }}
              >
                U
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Profile Information</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Update your personal details</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Full Name
                </label>
                <input type="text" placeholder="John Doe" defaultValue="John Doe" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Email
                </label>
                <input type="email" placeholder="john@example.com" defaultValue="john@example.com" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Monthly Income (Optional)
                </label>
                <input type="number" placeholder="0" defaultValue="3500" style={{ width: '100%' }} />
              </div>
              <Button variant="primary" icon={User}>
                Update Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Wallet Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: walletConnected ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: walletConnected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                }}
              >
                <Wallet size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Cardano Wallet</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  {walletConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            {walletConnected ? (
              <div>
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--color-accent-muted)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                    Connected Address
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--color-accent)' }}>
                    {walletAddress}
                  </div>
                </div>
                <Button variant="outline" icon={Wallet} onClick={() => setWalletConnected(false)} fullWidth>
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
                  Connect your Cardano wallet to enable on-chain features like secure budget storage and fast Hydra payments.
                </p>
                <Button variant="primary" icon={Wallet} onClick={() => setWalletConnected(true)} fullWidth>
                  Connect Wallet
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Hydra L2 Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: hydraEnabled ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hydraEnabled ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  <Zap size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Hydra Layer 2</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    Enable fast and low-cost transactions
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setHydraEnabled(!hydraEnabled)}
                disabled={!walletConnected}
                style={{
                  width: '56px',
                  height: '32px',
                  background: hydraEnabled ? 'var(--color-accent)' : 'var(--color-surface)',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: walletConnected ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  opacity: walletConnected ? 1 : 0.5,
                }}
              >
                <motion.div
                  animate={{ x: hydraEnabled ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                  }}
                />
              </motion.button>
            </div>

            {!walletConnected && (
              <div
                style={{
                  padding: '12px',
                  background: 'var(--color-warning-muted)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Connect your wallet to enable Hydra L2
              </div>
            )}

            {hydraEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '12px',
                  background: 'var(--color-primary-muted)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--color-primary)' }}>
                  Hydra Session Active
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Session ID: hydra_session_x8j2k9...
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Privacy Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={28} style={{ color: 'var(--color-text-secondary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Privacy Controls</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Choose what data to share with AI agents
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'shareSpending', label: 'Share spending patterns', desc: 'Allow agents to analyze your expenses' },
                { key: 'shareIncome', label: 'Share income information', desc: 'Help agents provide income-based recommendations' },
                { key: 'shareBudget', label: 'Share budget data', desc: 'Enable budget optimization suggestions' },
                { key: 'shareTransactions', label: 'Share transaction details', desc: 'Improve categorization accuracy' },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setPrivacySettings({
                        ...privacySettings,
                        [item.key]: !privacySettings[item.key as keyof typeof privacySettings],
                      })
                    }
                    style={{
                      width: '56px',
                      height: '32px',
                      background: privacySettings[item.key as keyof typeof privacySettings]
                        ? 'var(--color-accent)'
                        : 'var(--color-border)',
                      borderRadius: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      animate={{
                        x: privacySettings[item.key as keyof typeof privacySettings] ? 26 : 2,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{
                        width: '28px',
                        height: '28px',
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {privacySettings[item.key as keyof typeof privacySettings] ? (
                        <Eye size={14} style={{ color: 'var(--color-accent)' }} />
                      ) : (
                        <EyeOff size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: '24px' }}>
          <Card>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Data Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="outline" icon={Download} fullWidth>
                Export All Data
              </Button>
              <Button variant="outline" icon={Trash2} onClick={() => setShowDeleteModal(true)} fullWidth>
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" width="md">
          <div>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              Are you sure you want to delete your account? This action cannot be undone. All your data, transactions, and AI insights will be permanently removed.
            </p>
            <div
              style={{
                padding: '16px',
                background: 'var(--color-danger-muted)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '24px',
                border: '1px solid var(--color-danger)',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-danger)' }}>
                Warning: This action is irreversible
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <div style={{ background: 'var(--color-danger)', borderRadius: 'var(--radius-md)' }}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowDeleteModal(false)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </AnimatedPage>
  );
};
