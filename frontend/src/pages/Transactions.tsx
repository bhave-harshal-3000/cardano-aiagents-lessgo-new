import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  autoCategorized?: boolean;
  confidence?: number;
}

export const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-11-28',
      description: 'Whole Foods Market',
      category: 'Food & Dining',
      amount: -87.45,
      autoCategorized: true,
      confidence: 95,
    },
    {
      id: '2',
      date: '2024-11-27',
      description: 'Uber Ride',
      category: 'Transportation',
      amount: -24.30,
      autoCategorized: true,
      confidence: 98,
    },
    {
      id: '3',
      date: '2024-11-26',
      description: 'Netflix Subscription',
      category: 'Entertainment',
      amount: -15.99,
      autoCategorized: true,
      confidence: 100,
    },
    {
      id: '4',
      date: '2024-11-25',
      description: 'Amazon Purchase',
      category: 'Shopping',
      amount: -156.78,
    },
    {
      id: '5',
      date: '2024-11-24',
      description: 'Salary Deposit',
      category: 'Income',
      amount: 3500.00,
    },
    {
      id: '6',
      date: '2024-11-23',
      description: 'Electric Bill',
      category: 'Bills & Utilities',
      amount: -124.50,
      autoCategorized: true,
      confidence: 88,
    },
  ]);

  const categories = ['all', 'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Bills & Utilities', 'Income'];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Transactions</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
                Manage and categorize your transactions
              </p>
            </div>
            <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
              Add Transaction
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-tertiary)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ position: 'relative', minWidth: '200px' }}>
                <Filter
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-tertiary)',
                    pointerEvents: 'none',
                  }}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="none">
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
                      Category
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                      Amount
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                        }}
                        whileHover={{ background: 'var(--color-surface)' }}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                            <span style={{ fontSize: '14px' }}>
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>{transaction.description}</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '13px',
                                padding: '4px 12px',
                                background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              {transaction.category}
                            </span>
                            {transaction.autoCategorized && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  background: 'var(--color-primary-muted)',
                                  color: 'var(--color-primary)',
                                  borderRadius: 'var(--radius-sm)',
                                }}
                                title={`Auto-categorized (${transaction.confidence}% confidence)`}
                              >
                                AI {transaction.confidence}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px 24px',
                            textAlign: 'right',
                            fontWeight: '600',
                            fontSize: '15px',
                            color: transaction.amount > 0 ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          }}
                        >
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {/* Edit transaction */}}
                              style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-text-secondary)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-danger)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Add Transaction Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Date
              </label>
              <input type="date" style={{ width: '100%' }} defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Description
              </label>
              <input type="text" placeholder="e.g., Grocery shopping" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Category
              </label>
              <select style={{ width: '100%' }}>
                {categories.filter(c => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Amount
              </label>
              <input type="number" placeholder="0.00" style={{ width: '100%' }} step="0.01" />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" fullWidth onClick={() => setShowAddModal(false)}>
                Add Transaction
              </Button>
            </div>
          </div>
        </Modal>

        {/* QuickAdd Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <Plus size={28} />
        </motion.button>
      </div>
    </AnimatedPage>
  );
};
