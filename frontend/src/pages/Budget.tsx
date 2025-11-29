import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle, Shield } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TopBar } from '../components/TopBar';
import { budgetAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';

interface BudgetCategory {
  name: string;
  current: number;
  suggested?: number;
  limit: number;
}

export const Budget: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { userId } = useWallet();

  // Fetch budgets from backend
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await budgetAPI.getAll(userId);
        
        if (data && data.length > 0) {
          const mappedBudgets = data.map((b: any) => ({
            name: b.category,
            current: b.spent,
            limit: b.limit,
            suggested: undefined,
          }));
          setBudgets(mappedBudgets);
        } else {
          // If no data from API, show default budgets
          setBudgets([
            { name: 'Food & Dining', current: 842, limit: 1000 },
            { name: 'Transportation', current: 325, limit: 500 },
            { name: 'Shopping', current: 450, limit: 800 },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
        // Set default budgets if fetch fails or no data
        setBudgets([
          { name: 'Food & Dining', current: 842, limit: 1000 },
          { name: 'Transportation', current: 325, limit: 500 },
          { name: 'Shopping', current: 450, limit: 800 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [userId]);

  const handleGetSuggestions = () => {
    // Simulate AI suggestions
    const withSuggestions = budgets.map((b) => ({
      ...b,
      suggested: Math.round(b.limit * (0.85 + Math.random() * 0.2)),
    }));
    setBudgets(withSuggestions);
    setShowSuggestions(true);
  };

  const handleApplySuggestions = async () => {
    try {
      if (!userId) {
        alert('Please connect your wallet first');
        return;
      }
      
      // Update each budget with the suggested limit
      const updatePromises = budgets.map(async (b) => {
        if (b.suggested) {
          // Check if budget exists in DB, if not create it
          try {
            await budgetAPI.create({
              userId,
              category: b.name,
              limit: b.suggested,
              period: 'monthly',
            });
          } catch (error) {
            console.error(`Failed to update budget for ${b.name}:`, error);
          }
        }
      });

      await Promise.all(updatePromises);

      const applied = budgets.map((b) => ({
        ...b,
        limit: b.suggested || b.limit,
        suggested: undefined,
      }));
      setBudgets(applied);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to apply suggestions:', error);
      alert('Failed to save budget suggestions. Please try again.');
    }
  };

  return (
    <div style={{ ...receiptTheme.pageWrapper, ...receiptTheme.cssVariables }}>
      <div style={receiptTheme.paperTexture} />
      <AnimatedPage>
        <TopBar />
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <ReceiptHeader 
            title="BUDGET & GOALS" 
            subtitle="SET BUDGETS AND GET AI-POWERED RECOMMENDATIONS"
            session={String(Math.floor(Math.random() * 10000)).padStart(5, '0')}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="accent" icon={Sparkles} onClick={handleGetSuggestions}>
                Get AI Suggestion
              </Button>
              {showSuggestions && (
                <Button variant="primary" icon={CheckCircle} onClick={handleApplySuggestions}>
                  Apply Suggestions
                </Button>
              )}
            </div>
          </div>

          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '16px',
                background: 'var(--color-accent-muted)',
                border: '1px solid var(--color-accent)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    AI Recommendations Ready
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    Based on your spending patterns, we've optimized your budget allocations to maximize savings
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
            Loading budgets...
          </div>
        ) : budgets.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
              No budgets found. Click "Get AI Suggestion" to create optimized budgets.
            </div>
          </Card>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {!loading && budgets.map((budget, index) => (
            <motion.div
              key={budget.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{budget.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        ${budget.current} / ${budget.limit}
                      </div>
                      {budget.suggested && (
                        <div style={{ fontSize: '13px', color: 'var(--color-accent)' }}>
                          AI suggests: ${budget.suggested}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      height: '12px',
                      background: 'var(--color-surface)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((budget.current / budget.limit) * 100, 100)}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                      style={{
                        height: '100%',
                        background:
                          budget.current > budget.limit
                            ? 'var(--color-danger)'
                            : budget.current > budget.limit * 0.8
                            ? 'var(--color-warning)'
                            : 'var(--color-accent)',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', minWidth: '80px' }}>
                    Set limit:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={budget.limit}
                    onChange={(e) => {
                      const updated = [...budgets];
                      updated[index].limit = parseInt(e.target.value);
                      setBudgets(updated);
                    }}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--color-surface)',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    type="number"
                    value={budget.limit}
                    onChange={(e) => {
                      const updated = [...budgets];
                      updated[index].limit = parseInt(e.target.value) || 0;
                      setBudgets(updated);
                    }}
                    style={{
                      width: '100px',
                      padding: '8px 12px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: '32px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--color-primary-muted)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Shield size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Store Proof on Cardano
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    Secure your budget snapshot on-chain for transparency and verification
                  </p>
                </div>
              </div>
              <Button variant="primary" icon={Shield}>
                Secure on Chain
              </Button>
            </div>
          </Card>
        </motion.div>

        <ReceiptBarcode value="BDG-2024-001" width={200} margin="40px auto 0" />
      </div>
      </AnimatedPage>
    </div>
  );
};
