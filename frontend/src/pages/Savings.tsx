import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Target,
  Plus,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  Filter,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { PiggyBankAnimation } from '../components/PiggyBankAnimation';
import { TopBar } from '../components/TopBar';

interface SaveTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'manual' | 'auto';
  description: string;
}

export const Savings: React.FC = () => {
  const [totalSavings, setTotalSavings] = useState(0);
  const [displaySavings, setDisplaySavings] = useState(0);
  const [showQuickSaveModal, setShowQuickSaveModal] = useState(false);
  const [quickSaveAmount, setQuickSaveAmount] = useState('');
  const [showCoinDrop, setShowCoinDrop] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const savingsGoal = 5000;
  const actualSavings = 3245;
  const nextAutoSave = { date: '2025-12-01', amount: 150 };

  const [savingsHistory] = useState<SaveTransaction[]>([
    { id: '1', date: '2024-11-28', amount: 200, type: 'auto', description: 'Auto-save from paycheck' },
    { id: '2', date: '2024-11-25', amount: 50, type: 'manual', description: 'Quick save' },
    { id: '3', date: '2024-11-20', amount: 150, type: 'auto', description: 'Auto-save from paycheck' },
    { id: '4', date: '2024-11-15', amount: 100, type: 'manual', description: 'Bonus savings' },
    { id: '5', date: '2024-11-10', amount: 200, type: 'auto', description: 'Auto-save from paycheck' },
    { id: '6', date: '2024-11-05', amount: 75, type: 'manual', description: 'Quick save' },
  ]);

  const monthlyData = [
    { month: 'Jun', amount: 450 },
    { month: 'Jul', amount: 520 },
    { month: 'Aug', amount: 480 },
    { month: 'Sep', amount: 610 },
    { month: 'Oct', amount: 580 },
    { month: 'Nov', amount: 605 },
  ];

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

  useEffect(() => {
    setTotalSavings(actualSavings);
  }, []);

  // Count-up animation
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = totalSavings / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalSavings) {
        setDisplaySavings(totalSavings);
        clearInterval(timer);
      } else {
        setDisplaySavings(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalSavings]);

  const handleQuickSave = () => {
    const amount = parseFloat(quickSaveAmount);
    if (amount > 0) {
      setShowCoinDrop(true);
      setTimeout(() => {
        setTotalSavings((prev) => prev + amount);
        setShowCoinDrop(false);
        setShowQuickSaveModal(false);
        setQuickSaveAmount('');
      }, 1500);
    }
  };

  const sortedHistory = [...savingsHistory].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.amount - a.amount;
  });

  const progressPercentage = (totalSavings / savingsGoal) * 100;

  return (
    <AnimatedPage>
      <TopBar />
      <div role="main" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with Piggy Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px', textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
          >
            <PiggyBankAnimation />
          </motion.div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Savings</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            Track your savings journey and reach your financial goals
          </p>
        </motion.div>

        {/* Coin Drop Animation Overlay */}
        <AnimatePresence>
          {showCoinDrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, x: 0, opacity: 1, scale: 1 }}
                  animate={{
                    y: [- 100, window.innerHeight],
                    x: [0, (Math.random() - 0.5) * 200],
                    opacity: [1, 1, 0],
                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeIn',
                  }}
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f5a623',
                    boxShadow: '0 4px 16px rgba(245, 166, 35, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  ₳
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total Savings Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <Card>
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', marginBottom: '12px' }}>
                Total Savings
              </p>
              <motion.div
                key={totalSavings}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '56px',
                  fontWeight: '700',
                  color: 'var(--color-accent)',
                  textShadow: '0 0 30px rgba(80, 200, 120, 0.3)',
                }}
              >
                ${displaySavings.toLocaleString()}
              </motion.div>
              <div style={{ marginTop: '24px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Plus}
                  onClick={() => setShowQuickSaveModal(true)}
                  aria-label="Quick Save"
                >
                  Quick Save
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goals and Auto-Save Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Savings Goal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Target size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Savings Goal</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Emergency Fund</p>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Progress</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '12px',
                    background: 'var(--color-surface)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                      boxShadow: '0 0 12px rgba(80, 200, 120, 0.5)',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Current</span>
                <span style={{ fontWeight: '600' }}>${totalSavings.toLocaleString()} / ${savingsGoal.toLocaleString()}</span>
              </div>
            </Card>
          </motion.div>

          {/* Auto-Save Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-warning-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-warning)',
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Auto-Save Schedule</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Next scheduled save</p>
                </div>
              </div>
              <div style={{ padding: '16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Calendar size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                  <span style={{ fontSize: '14px' }}>
                    {new Date(nextAutoSave.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ArrowUpCircle size={18} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-accent)' }}>
                    ${nextAutoSave.amount}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Savings History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <TrendingUp size={24} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Monthly Savings Trend</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '0 8px' }}>
              {monthlyData.map((data, index) => {
                const heightPercent = (data.amount / maxAmount) * 100;
                return (
                  <div
                    key={data.month}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${heightPercent}%`, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(80, 200, 120, 0.4)' }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(180deg, var(--color-accent), var(--color-primary))',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        position: 'relative',
                        minHeight: '20px',
                      }}
                      title={`$${data.amount}`}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-24px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        ${data.amount}
                      </div>
                    </motion.div>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Saves List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card padding="none">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Saves</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Filter size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                    aria-label="Sort by"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                      Date
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                      Description
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                      Type
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {sortedHistory.map((save, index) => (
                      <motion.tr
                        key={save.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                        whileHover={{ background: 'var(--color-surface)' }}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                            <span style={{ fontSize: '14px' }}>
                              {new Date(save.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>{save.description}</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              padding: '4px 12px',
                              background: save.type === 'auto' ? 'var(--color-warning-muted)' : 'var(--color-primary-muted)',
                              color: save.type === 'auto' ? 'var(--color-warning)' : 'var(--color-primary)',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            {save.type === 'auto' ? 'Auto-Save' : 'Manual'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '16px 24px',
                            textAlign: 'right',
                            fontWeight: '600',
                            fontSize: '15px',
                            color: 'var(--color-accent)',
                          }}
                        >
                          +${save.amount.toFixed(2)}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Quick Save Modal */}
        <Modal
          isOpen={showQuickSaveModal}
          onClose={() => setShowQuickSaveModal(false)}
          title="Quick Save"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Add money to your savings instantly
            </p>
            <div>
              <label
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}
                htmlFor="quickSaveAmount"
              >
                Amount
              </label>
              <input
                id="quickSaveAmount"
                type="number"
                placeholder="0.00"
                value={quickSaveAmount}
                onChange={(e) => setQuickSaveAmount(e.target.value)}
                style={{ width: '100%', fontSize: '18px', padding: '12px' }}
                min="0"
                step="0.01"
                aria-label="Quick save amount"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setQuickSaveAmount(amount.toString())}
                  size="sm"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowQuickSaveModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleQuickSave}
                icon={CheckCircle}
                disabled={!quickSaveAmount || parseFloat(quickSaveAmount) <= 0}
              >
                Save Now
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AnimatedPage>
  );
};
