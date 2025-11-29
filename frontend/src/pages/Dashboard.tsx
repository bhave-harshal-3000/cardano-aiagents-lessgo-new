import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Target,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Shield,
  Calendar,
} from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';

export const Dashboard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAIModal, setShowAIModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Spend',
      value: '$2,847',
      change: '+12%',
      trend: 'up' as const,
      color: 'var(--color-danger)',
    },
    {
      icon: PiggyBank,
      label: 'Total Saved',
      value: '$1,523',
      change: '+8%',
      trend: 'up' as const,
      color: 'var(--color-accent)',
    },
    {
      icon: Target,
      label: 'Goal Progress',
      value: '68%',
      change: '+5%',
      trend: 'up' as const,
      color: 'var(--color-primary)',
    },
    {
      icon: TrendingDown,
      label: 'vs Last Month',
      value: '-4%',
      change: 'Better',
      trend: 'down' as const,
      color: 'var(--color-accent)',
    },
  ];

  const categories = [
    { name: 'Food & Dining', amount: 842, percentage: 30, color: '#4a90e2' },
    { name: 'Transportation', amount: 425, percentage: 15, color: '#50c878' },
    { name: 'Entertainment', amount: 380, percentage: 13, color: '#f5a623' },
    { name: 'Shopping', amount: 650, percentage: 23, color: '#e85d75' },
    { name: 'Bills & Utilities', amount: 550, percentage: 19, color: '#9b59b6' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const recentTransactions = [
    { id: 1, description: 'Whole Foods', amount: -87.45, type: 'expense', time: '2m ago' },
    { id: 2, description: 'Salary Deposit', amount: 3500.00, type: 'income', time: '1h ago' },
    { id: 3, description: 'Netflix', amount: -15.99, type: 'expense', time: '3h ago' },
    { id: 4, description: 'Uber Ride', amount: -24.30, type: 'expense', time: '5h ago' },
    { id: 5, description: 'Amazon', amount: -156.78, type: 'expense', time: '1d ago' },
  ];

  return (
    <AnimatedPage>
      <TopBar />
      <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '32px' }}>
        {/* Left Side - Main Dashboard */}
        <div style={{ flex: '1', minWidth: '0' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Dashboard</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
                Monthly financial overview
              </p>
            </div>

            {/* Month Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  setCurrentMonth(newMonth);
                }}
                style={{
                  padding: '8px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                }}
              >
                <ChevronLeft size={20} />
              </motion.button>
              <div
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '500',
                  minWidth: '140px',
                  textAlign: 'center',
                }}
              >
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setCurrentMonth(newMonth);
                }}
                style={{
                  padding: '8px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover decorative>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: `${stat.color}20`,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px',
                          color: stat.color,
                        }}
                      >
                        <stat.icon size={24} />
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                        {stat.label}
                      </p>
                      <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</h3>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                      style={{
                        padding: '4px 8px',
                        background: stat.trend === 'up' ? 'var(--color-accent-muted)' : 'var(--color-primary-muted)',
                        color: stat.trend === 'up' ? 'var(--color-accent)' : 'var(--color-primary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {stat.change}
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', marginBottom: '24px' }}>
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card decorative>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                Spending by Category
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{category.name}</span>
                      <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        ${category.amount}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: 'var(--color-surface)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: category.color,
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  variant="primary"
                  icon={Plus}
                  fullWidth
                  onClick={() => setShowExpenseModal(true)}
                >
                  Quick Add Expense
                </Button>
                <Button
                  variant="accent"
                  icon={Sparkles}
                  fullWidth
                  onClick={() => setShowAIModal(true)}
                >
                  Ask AI to Optimize Budget
                </Button>
                <Button variant="outline" icon={Shield} fullWidth>
                  Secure Summary on Cardano
                </Button>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'var(--color-primary-muted)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Next Goal Milestone</h4>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  Save $200 more to reach your monthly savings goal
                </p>
                <motion.div
                  style={{
                    marginTop: '12px',
                    height: '6px',
                    background: 'var(--color-surface)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                    style={{
                      height: '100%',
                      background: 'var(--color-primary)',
                    }}
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trend Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card decorative>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
              6-Month Spending Trend
            </h3>
            <div
              style={{
                height: '300px',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                padding: '24px',
                gap: '12px',
              }}
            >
              {[65, 82, 75, 90, 78, 100].map((height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  style={{
                    flex: 1,
                    background: `linear-gradient(180deg, var(--color-primary), var(--color-accent))`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: '20px',
                  }}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Optimization Modal */}
        <Modal isOpen={showAIModal} onClose={() => setShowAIModal(false)} title="AI Budget Optimization" width="lg">
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Select an AI agent to analyze your spending and provide recommendations:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Card hover>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Budget Planner v1</h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Analyzes spending patterns and suggests optimal budget allocation
                </p>
              </Card>
              <Card hover>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Savings Maximizer</h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Identifies opportunities to increase savings without compromising lifestyle
                </p>
              </Card>
            </div>
          </div>
          <Button variant="primary" fullWidth>
            Run Analysis
          </Button>
        </Modal>

        {/* Quick Add Expense Modal */}
        <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Quick Add Expense">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                style={{ width: '100%', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Category
              </label>
              <select style={{ width: '100%' }}>
                <option>Food & Dining</option>
                <option>Transportation</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Bills & Utilities</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Description
              </label>
              <input
                type="text"
                placeholder="What was this for?"
                style={{ width: '100%' }}
              />
            </div>
            <Button variant="primary" fullWidth>
              Add Expense
            </Button>
          </div>
        </Modal>
        </div>

        {/* Right Side - Receipt Printer Animation */}
        <div style={{ width: '380px', flexShrink: 0 }}>
          <ReceiptPrinter transactions={recentTransactions} />
        </div>
      </div>
    </AnimatedPage>
  );
};

// Receipt Printer Component
const ReceiptPrinter: React.FC<{ transactions: Array<{ id: number; description: string; amount: number; type: string; time: string }> }> = ({ transactions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % transactions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [transactions.length]);

  const currentTx = transactions[currentIndex];
  const isIncome = currentTx.type === 'income';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      style={{ position: 'sticky', top: '100px' }}
    >
      <Card decorative>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
          Recent Activity
        </h3>

        {/* Receipt Printer Machine */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Printer Body */}
          <div
            style={{
              width: '100%',
              maxWidth: '280px',
              background: 'linear-gradient(180deg, #3d4f5f 0%, #2c3e50 50%, #1f2d3d 100%)',
              borderRadius: '12px 12px 8px 8px',
              padding: '24px 20px 16px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1)',
              position: 'relative',
              border: '1px solid rgba(0,0,0,0.3)',
            }}
          >
            {/* Top Panel with vents */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '20px',
                right: '60px',
                height: '4px',
                display: 'flex',
                gap: '3px',
              }}
            >
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '1px',
                  }}
                />
              ))}
            </div>

            {/* Brand Label */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '20px',
                fontSize: '8px',
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '1px',
              }}
            >
              FINANCEAI POS
            </div>

            {/* Status Light with bezel */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                width: '18px',
                height: '18px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.6)',
              }}
            >
              <motion.div
                animate={{
                  backgroundColor: isIncome ? '#50c878' : '#e85d75',
                  boxShadow: isIncome
                    ? '0 0 15px rgba(80, 200, 120, 0.8), inset 0 -1px 2px rgba(0,0,0,0.3)'
                    : '0 0 15px rgba(232, 93, 117, 0.8), inset 0 -1px 2px rgba(0,0,0,0.3)',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Metal frame around slot */}
            <div
              style={{
                padding: '4px',
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
                borderRadius: '6px',
                marginBottom: '16px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.1)',
              }}
            >
              {/* Printer Slot */}
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
                  borderRadius: '3px',
                  boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle internal glow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(100,100,100,0.2) 50%, transparent 100%)',
                  }}
                />
              </div>
            </div>

            {/* Side screws */}
            {[10, 30].map((top) => (
              <React.Fragment key={top}>
                <div
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: `${top}px`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
                    boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '4px',
                      height: '1px',
                      background: 'rgba(0,0,0,0.4)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(45deg)',
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: `${top}px`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
                    boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '4px',
                      height: '1px',
                      background: 'rgba(0,0,0,0.4)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(45deg)',
                    }}
                  />
                </div>
              </React.Fragment>
            ))}

            {/* Receipt Paper Coming Out with Printing Animation */}
            <motion.div
              key={currentTx.id}
              initial={{ y: -150, opacity: 0, scaleY: 0.3 }}
              animate={{ 
                y: [0, 15, 0],
                opacity: 1,
                scaleY: 1,
              }}
              exit={{ y: 150, opacity: 0, scaleY: 0.8 }}
              transition={{ 
                y: { duration: 0.6, ease: 'easeOut', times: [0, 0.7, 1], repeat: 0 },
                opacity: { duration: 0.4 },
                scaleY: { duration: 0.5, ease: 'easeOut' }
              }}
              style={{
                width: '90%',
                margin: '0 auto',
                background: '#ffffff',
                borderRadius: '4px 4px 0 0',
                padding: '16px 12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                position: 'relative',
                transformOrigin: 'top center',
              }}
            >
              {/* Receipt Header */}
              <div style={{ borderBottom: '1px dashed #999', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                  FINANCEAI
                </div>
                <div style={{ fontSize: '11px', color: '#7f8c8d', textAlign: 'center', marginTop: '4px' }}>
                  Transaction Receipt
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{ fontSize: '12px', color: '#2c3e50', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#7f8c8d' }}>Time:</span>
                  <span>{currentTx.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#7f8c8d' }}>Type:</span>
                  <span style={{ 
                    color: isIncome ? '#50c878' : '#e85d75',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}>
                    {currentTx.type}
                  </span>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ color: '#7f8c8d', marginBottom: '4px' }}>Description:</div>
                  <div style={{ fontWeight: '500' }}>{currentTx.description}</div>
                </div>
              </div>

              {/* Amount */}
              <div
                style={{
                  borderTop: '1px dashed #999',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: 'bold' }}>AMOUNT:</span>
                <motion.span
                  key={`amount-${currentTx.id}`}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: isIncome ? '#50c878' : '#e85d75',
                  }}
                >
                  {isIncome ? '+' : ''}${Math.abs(currentTx.amount).toFixed(2)}
                </motion.span>
              </div>

              {/* Receipt Footer */}
              <div
                style={{
                  borderTop: '1px dashed #999',
                  paddingTop: '8px',
                  marginTop: '8px',
                  fontSize: '10px',
                  color: '#95a5a6',
                  textAlign: 'center',
                }}
              >
                Thank you for using FinanceAI
              </div>

              {/* Paper Tear Effect */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  right: 0,
                  height: '8px',
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, #ffffff 4px, #ffffff 8px)',
                }}
              />
            </motion.div>

            {/* Printing Sound Visual Effect */}
            <motion.div
              key={`print-${currentTx.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.5, repeat: 2, repeatDelay: 0.2 }}
              style={{
                position: 'absolute',
                top: '-2px',
                left: '10%',
                right: '10%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(74, 144, 226, 0.6) 50%, transparent 100%)',
                borderRadius: '2px',
              }}
            />

            {/* Paper being pulled out effect */}
            <motion.div
              key={`pull-${currentTx.id}`}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 1, 1],
                opacity: [0, 0.5, 0.5, 0],
                y: [0, 0, 10, 20]
              }}
              transition={{ 
                duration: 1.2,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '82%',
                height: '25px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                borderRadius: '0 0 4px 4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transformOrigin: 'top center',
              }}
            />
          </div>

          {/* Transaction List Below */}
          <div style={{ marginTop: '32px', width: '100%' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>
              All Transactions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    padding: '12px',
                    background: currentIndex === index ? 'var(--color-surface)' : 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        {tx.time}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: tx.type === 'income' ? 'var(--color-accent)' : 'var(--color-danger)',
                      }}
                    >
                      {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
