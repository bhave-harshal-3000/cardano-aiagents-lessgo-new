import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle, Shield, Plus, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TopBar } from '../components/TopBar';
import { useWallet } from '../contexts/WalletContext';
import { receiptTheme } from '../styles/receiptTheme';
import { ReceiptBarcode, ReceiptHeader } from '../components';

interface BudgetGoal {
  _id?: string;
  goalName: string;
  category: 'gadget' | 'vehicle' | 'travel' | 'education' | 'luxury' | 'other';
  targetAmount: number;
  currentSavings: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused' | 'abandoned';
}

export const Budget: React.FC = () => {
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [plan, setPlan] = useState<string>('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [formData, setFormData] = useState<BudgetGoal>({
    goalName: '',
    category: 'gadget',
    targetAmount: 0,
    currentSavings: 0,
    deadline: '',
    priority: 'medium',
    status: 'active',
  });

  const { userId } = useWallet();

  // Fetch user's budget goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/budget-plan/user/${userId}`);
        const data = await response.json();
        
        if (data.success && data.goals) {
          setGoals(data.goals);
        }
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [userId]);

  // Generate AI plan
  const handleGeneratePlan = async () => {
    if (!userId) {
      alert('Please connect wallet first');
      return;
    }

    try {
      setLoadingPlan(true);
      const response = await fetch(`/api/budget-plan/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setPlan(data.plan);
      } else {
        alert(data.message || 'Failed to generate plan');
      }
    } catch (error) {
      console.error('Failed to generate plan:', error);
      alert('Error generating plan');
    } finally {
      setLoadingPlan(false);
    }
  };

  // Create new budget goal
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Please connect wallet first');
      return;
    }

    try {
      const response = await fetch('/api/budget-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
          deadline: new Date(formData.deadline).toISOString(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGoals([...goals, data.goal]);
        setFormData({
          goalName: '',
          category: 'gadget',
          targetAmount: 0,
          currentSavings: 0,
          deadline: '',
          priority: 'medium',
          status: 'active',
        });
        setShowForm(false);
        setPlan('');
      } else {
        alert(data.error || 'Failed to create goal');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      alert('Error creating goal');
    }
  };

  // Update savings
  const handleUpdateSavings = async (goalId: string, newSavings: number) => {
    try {
      const response = await fetch(`/api/budget-plan/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSavings: newSavings }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGoals(goals.map(g => g._id === goalId ? data.goal : g));
      }
    } catch (error) {
      console.error('Failed to update savings:', error);
    }
  };

  const daysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div style={{ ...receiptTheme.pageWrapper, ...receiptTheme.cssVariables }}>
      <div style={receiptTheme.paperTexture} />
      <AnimatedPage>
        <TopBar />
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
            <ReceiptHeader 
              title="SAVINGS GOALS" 
              subtitle="PLAN AND TRACK YOUR FINANCIAL GOALS"
              session={String(Math.floor(Math.random() * 10000)).padStart(5, '0')}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="primary" icon={Plus} onClick={() => setShowForm(!showForm)}>
                  New Goal
                </Button>
                {goals.length > 0 && (
                  <Button variant="accent" icon={Sparkles} onClick={handleGeneratePlan} disabled={loadingPlan}>
                    {loadingPlan ? 'Generating...' : 'Get AI Plan'}
                  </Button>
                )}
              </div>
            </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <form onSubmit={handleCreateGoal} style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Goal Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Watch, Bike, Laptop"
                          value={formData.goalName}
                          onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px',
                          }}
                        >
                          <option value="gadget">Gadget</option>
                          <option value="vehicle">Vehicle</option>
                          <option value="travel">Travel</option>
                          <option value="education">Education</option>
                          <option value="luxury">Luxury</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Target Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.targetAmount}
                          onChange={(e) => setFormData({ ...formData, targetAmount: parseInt(e.target.value) })}
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px',
                          }}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Button type="submit" variant="primary" icon={CheckCircle}>
                        Create Goal
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        icon={X}
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {plan && (
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <TrendingUp size={20} style={{ color: 'var(--color-accent)', marginTop: '4px' }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Your Personalized Plan
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {plan}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
              Loading goals...
            </div>
          ) : goals.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
                No savings goals yet. Click "New Goal" to create one!
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {goals.map((goal, index) => (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                            {goal.goalName}
                          </h3>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            <span>Category: {goal.category}</span>
                            <span>Priority: {goal.priority}</span>
                            <span>Days left: {daysRemaining(goal.deadline)}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: '700' }}>
                            ₹{goal.currentSavings} / ₹{goal.targetAmount}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            {Math.round((goal.currentSavings / goal.targetAmount) * 100)}% complete
                          </div>
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
                          animate={{ width: `${Math.min((goal.currentSavings / goal.targetAmount) * 100, 100)}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                          style={{
                            height: '100%',
                            background: goal.currentSavings >= goal.targetAmount
                              ? 'var(--color-success)'
                              : 'var(--color-accent)',
                            borderRadius: '6px',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', minWidth: '120px' }}>
                        Update savings:
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={goal.targetAmount}
                        value={goal.currentSavings}
                        onChange={(e) => handleUpdateSavings(goal._id || '', parseInt(e.target.value))}
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
                        min="0"
                        max={goal.targetAmount}
                        value={goal.currentSavings}
                        onChange={(e) => handleUpdateSavings(goal._id || '', parseInt(e.target.value))}
                        style={{
                          width: '100px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

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
                      Secure your savings goals on-chain for transparency
                    </p>
                  </div>
                </div>
                <Button variant="primary" icon={Shield}>
                  Secure on Chain
                </Button>
              </div>
            </Card>
          </motion.div>

          <ReceiptBarcode value="SAV-2024-001" width={200} margin="40px auto 0" />
        </div>
      </AnimatedPage>
    </div>
  );
};
