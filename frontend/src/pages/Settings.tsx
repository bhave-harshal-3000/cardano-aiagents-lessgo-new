import { motion } from 'framer-motion';
import { User, Wallet, Zap, Shield, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';
import { receiptTheme } from '../styles/receiptTheme';
import { ReceiptHeader } from '../components';
import { useWallet } from '../contexts/WalletContext';
import { transactionAPI, budgetAPI, savingsAPI } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Settings: React.FC = () => {
  const { walletAddress, connectWallet, disconnectWallet, userId } = useWallet();
  const [hydraEnabled, setHydraEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    shareSpending: true,
    shareIncome: false,
    shareBudget: true,
    shareTransactions: true,
  });

  const walletConnected = !!walletAddress;

  const handleExportData = async () => {
    if (!userId) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setExporting(true);

      // Fetch all user data
      const [transactions, budgets, savings] = await Promise.all([
        transactionAPI.getAll(userId),
        budgetAPI.getAll(userId),
        savingsAPI.getAll(userId),
      ]);

      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Title Page
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('FINANCEBOT DATA EXPORT', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Export Date: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 7;
      const shortAddress = walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}` : 'Not connected';
      doc.text(`Wallet: ${shortAddress}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 15;

      // Transactions Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Transactions', 14, yPos);
      yPos += 5;

      const transactionData = transactions
        .filter((tx: any) => tx.category !== 'HTML Import')
        .map((tx: any) => [
          new Date(tx.date).toLocaleDateString(),
          tx.description,
          tx.category,
          `${tx.type === 'expense' ? '-' : '+'}$${tx.amount.toFixed(2)}`
        ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Description', 'Category', 'Amount']],
        body: transactionData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 70 },
          2: { cellWidth: 40 },
          3: { cellWidth: 35, halign: 'right' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Budgets Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Budgets', 14, yPos);
      yPos += 5;

      const budgetData = budgets.map((budget: any) => {
        const progress = budget.limit > 0 ? ((budget.spent / budget.limit) * 100).toFixed(1) : '0.0';
        return [
          budget.category,
          `$${budget.limit.toFixed(2)}`,
          `$${(budget.spent || 0).toFixed(2)}`,
          budget.period || 'monthly',
          `${progress}%`
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Limit', 'Spent', 'Period', 'Progress']],
        body: budgetData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 30, halign: 'right' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30 },
          4: { cellWidth: 25, halign: 'right' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Savings Goals Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Savings Goals', 14, yPos);
      yPos += 5;

      const savingsData = savings.map((goal: any) => {
        const progress = goal.targetAmount > 0 ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1) : '0.0';
        return [
          goal.goalName,
          `$${goal.targetAmount.toFixed(2)}`,
          `$${goal.currentAmount.toFixed(2)}`,
          `${progress}%`,
          new Date(goal.deadline).toLocaleDateString()
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Goal', 'Target', 'Current', 'Progress', 'Deadline']],
        body: savingsData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30, halign: 'right' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 35 }
        }
      });

      // Save PDF
      doc.save(`financebot-export-${new Date().toISOString().split('T')[0]}.pdf`);

      alert('Data exported successfully as PDF!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ ...receiptTheme.pageWrapper, ...receiptTheme.cssVariables }}>
      <div style={receiptTheme.paperTexture} />
      <AnimatedPage>
        <TopBar walletAddress={walletAddress || undefined} />
        <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <ReceiptHeader 
            title="SETTINGS" 
            subtitle="MANAGE YOUR PROFILE, WALLET, AND PREFERENCES"
            session={String(Math.floor(Math.random() * 10000)).padStart(5, '0')}
          />
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
                <Button variant="outline" icon={Wallet} onClick={disconnectWallet} fullWidth>
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
                  Connect your Cardano wallet to enable on-chain features like secure budget storage and fast Hydra payments.
                </p>
                <Button variant="primary" icon={Wallet} onClick={connectWallet} fullWidth>
                  Connect Wallet
                </Button>
              </div>
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
              <Button 
                variant="outline" 
                icon={Download} 
                fullWidth 
                onClick={handleExportData}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Export All Data'}
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
    </div>
  );
};
