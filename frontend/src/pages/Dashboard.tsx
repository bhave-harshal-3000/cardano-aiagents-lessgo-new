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
import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { PiggyBankAnimation } from '../components/PiggyBankAnimation';
import { TopBar } from '../components/TopBar';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <AnimatedPage>
      <TopBar />
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
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
                onClick={stat.label === 'Total Saved' ? () => navigate('/savings') : undefined}
                style={{ cursor: stat.label === 'Total Saved' ? 'pointer' : 'default' }}
              >
                <Card hover>
                  {stat.label === 'Total Saved' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
                      <PiggyBankAnimation />
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px', marginBottom: '8px' }}>
                        {stat.label}
                      </p>
                      <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</h3>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                        style={{
                          padding: '4px 8px',
                          background: 'var(--color-accent-muted)',
                          color: 'var(--color-accent)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '8px',
                        }}
                      >
                        <TrendingUp size={14} />
                        {stat.change}
                      </motion.div>
                    </div>
                  ) : (
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
                  )}
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
            <Card>
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
          <Card>
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
    </AnimatedPage>
  );
};
