import { motion } from 'framer-motion';
import { Target, Calendar, Plus, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';
import { savingsAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';
import { receiptTheme } from '../styles/receiptTheme';
import { ReceiptBarcode, ReceiptHeader } from '../components';

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export const Savings: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [coinDrop, setCoinDrop] = useState(0);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    deadline: new Date().toISOString().split('T')[0],
  });

  const { userId } = useWallet();
  const colors = ['#4a90e2', '#50c878', '#f5a623', '#9b59b6', '#e85d75', '#34a853'];

  // Fetch savings goals from backend
  useEffect(() => {
    const fetchSavings = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await savingsAPI.getAll(userId);
        
        if (data && data.length > 0) {
          const mappedSavings = data.map((s: any, index: number) => ({
            id: s._id,
            name: s.goalName,
            target: s.targetAmount,
            current: s.currentAmount,
            deadline: new Date(s.deadline).toISOString().split('T')[0],
            color: colors[index % colors.length],
          }));
          setSavingsGoals(mappedSavings);
        } else {
          // Default savings goals if no data
          setSavingsGoals([
            {
              id: '1',
              name: 'Emergency Fund',
              target: 10000,
              current: 6500,
              deadline: '2025-12-31',
              color: '#4a90e2',
            },
            {
              id: '2',
              name: 'Vacation to Japan',
              target: 5000,
              current: 2800,
              deadline: '2025-08-15',
              color: '#50c878',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch savings:', error);
        // Default savings goals on error
        setSavingsGoals([
          {
            id: '1',
            name: 'Emergency Fund',
            target: 10000,
            current: 6500,
            deadline: '2025-12-31',
            color: '#4a90e2',
          },
          {
            id: '2',
            name: 'Vacation to Japan',
            target: 5000,
            current: 2800,
            deadline: '2025-08-15',
            color: '#50c878',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, [userId]);

  // Handler to add new savings goal
  const handleAddGoal = async () => {
    try {
      if (!userId) {
        alert('Please connect your wallet first');
        return;
      }
      
      const target = parseFloat(formData.target);
      const current = parseFloat(formData.current) || 0;
      
      if (!formData.name || isNaN(target) || !formData.deadline) {
        alert('Please fill in all required fields');
        return;
      }

      const newGoal = await savingsAPI.create({
        userId,
        goalName: formData.name,
        targetAmount: target,
        currentAmount: current,
        deadline: new Date(formData.deadline),
      });

      // Add to local state
      const mappedGoal = {
        id: newGoal._id,
        name: newGoal.goalName,
        target: newGoal.targetAmount,
        current: newGoal.currentAmount,
        deadline: new Date(newGoal.deadline).toISOString().split('T')[0],
        color: colors[savingsGoals.length % colors.length],
      };
      
      setSavingsGoals([...savingsGoals, mappedGoal]);
      
      // Reset form and close modal
      setFormData({
        name: '',
        target: '',
        current: '',
        deadline: new Date().toISOString().split('T')[0],
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add savings goal:', error);
      alert('Failed to add savings goal. Please try again.');
    }
  };

  // Random coin drop animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoinDrop((prev) => prev + 1);
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, []);

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div style={{ ...receiptTheme.pageWrapper, ...receiptTheme.cssVariables }}>
      <div style={receiptTheme.paperTexture} />
      <AnimatedPage>
        <TopBar />
        <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '32px', position: 'relative', zIndex: 2 }}>
        {/* Left Side - Savings Details */}
        <div style={{ flex: '1', minWidth: '0' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <ReceiptHeader 
                title="SAVINGS GOALS" 
                subtitle="TRACK YOUR SAVINGS AND ACHIEVE YOUR FINANCIAL GOALS"
                session={String(Math.floor(Math.random() * 10000)).padStart(5, '0')}
              />
              <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                New Goal
              </Button>
            </div>

            {/* Overall Stats */}
            <Card decorative>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    Total Saved
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-accent)' }}>
                    ${totalSaved.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    Total Target
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700' }}>
                    ${totalTarget.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    Overall Progress
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)' }}>
                    {overallProgress.toFixed(1)}%
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Savings Goals List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
              Loading savings goals...
            </div>
          ) : savingsGoals.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
                No savings goals yet. Click "New Goal" to create one.
              </div>
            </Card>
          ) : null}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!loading && savingsGoals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card decorative>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{goal.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Target size={14} />
                            ${goal.target.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: goal.color }}>
                          ${goal.current.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                          {progress.toFixed(1)}% complete
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ position: 'relative', height: '8px', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 + 0.3 }}
                        style={{
                          height: '100%',
                          background: goal.color,
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <Button variant="outline" size="sm" icon={Plus}>
                        Add Funds
                      </Button>
                      <Button variant="ghost" size="sm" icon={Sparkles}>
                        AI Optimize
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '24px' }}
          >
            <Card decorative>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-primary-muted)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>AI Recommendation</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                    Based on your spending patterns, you can increase your Emergency Fund contribution by $200/month by
                    reducing dining out expenses. This will help you reach your goal 3 months earlier.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Sticky Animated Piggy Bank */}
        <div style={{ width: '400px', flexShrink: 0, position: 'sticky', top: '100px', height: 'fit-content' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Card decorative>
              <div style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* Piggy Bank with Breathing Animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <PiggyBankSVG />
                </motion.div>

                {/* Coin Drop Animations */}
                {[...Array(5)].map((_, i) => (
                  <CoinDrop key={`${coinDrop}-${i}`} delay={i * 0.3} />
                ))}

                {/* Background Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, var(--color-primary-muted) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 1,
                  }}
                />
              </div>

              {/* Motivational Text */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <motion.h3
                  key={coinDrop}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-primary)' }}
                >
                  Keep Saving!
                </motion.h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Every small contribution brings you closer to your goals
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setFormData({
          name: '',
          target: '',
          current: '',
          deadline: new Date().toISOString().split('T')[0],
        });
      }} title="Create Savings Goal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Goal Name
            </label>
            <input 
              type="text" 
              placeholder="e.g., Emergency Fund" 
              style={{ width: '100%' }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Target Amount
            </label>
            <input 
              type="number" 
              placeholder="10000" 
              style={{ width: '100%' }}
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Current Amount (Optional)
            </label>
            <input 
              type="number" 
              placeholder="0" 
              style={{ width: '100%' }}
              value={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Target Date
            </label>
            <input 
              type="date" 
              style={{ width: '100%' }}
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="outline" fullWidth onClick={() => {
              setShowAddModal(false);
              setFormData({
                name: '',
                target: '',
                current: '',
                deadline: new Date().toISOString().split('T')[0],
              });
            }}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={handleAddGoal}>
              Create Goal
            </Button>
          </div>
        </div>
      </Modal>

      <ReceiptBarcode value="SAV-2024-001" width={200} margin="40px auto 0" />
      </AnimatedPage>
    </div>
  );
};

// Coin Drop Component
const CoinDrop: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100 - 50;

  return (
    <motion.div
      initial={{ y: -100, x: randomX, opacity: 0, rotate: 0 }}
      animate={{
        y: [0, 180],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: 'easeIn',
      }}
      style={{
        position: 'absolute',
        top: '20px',
        zIndex: 3,
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          background: 'linear-gradient(135deg, #f5a623 0%, #f39c12 100%)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(245, 166, 35, 0.4)',
          border: '3px solid #f9ca7b',
        }}
      />
    </motion.div>
  );
};

// Piggy Bank SVG Component - Based on reference image
const PiggyBankSVG: React.FC = () => {
  return (
    <svg
      width="320"
      height="280"
      viewBox="0 0 400 350"
      fill="none"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(74, 144, 226, 0.3))' }}
    >
      <defs>
        <linearGradient id="pigBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffb88c" />
          <stop offset="100%" stopColor="#ff9966" />
        </linearGradient>
        <linearGradient id="pigDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9966" />
          <stop offset="100%" stopColor="#ff8855" />
        </linearGradient>
        <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd966" />
          <stop offset="100%" stopColor="#ffbb33" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="200" cy="310" rx="140" ry="20" fill="#000000" opacity="0.15" />

      {/* Back left leg */}
      <rect x="140" y="260" width="30" height="50" rx="15" fill="url(#pigDark)" />
      
      {/* Back right leg */}
      <rect x="230" y="260" width="30" height="50" rx="15" fill="url(#pigDark)" />

      {/* Main body - large rounded circle */}
      <ellipse cx="200" cy="180" rx="110" ry="100" fill="url(#pigBody)" />
      
      {/* Body bottom shade */}
      <ellipse cx="200" cy="220" rx="100" ry="70" fill="url(#pigDark)" opacity="0.3" />

      {/* Ear */}
      <ellipse cx="160" cy="90" rx="18" ry="28" fill="url(#pigBody)" transform="rotate(-20 160 90)" />
      <ellipse cx="162" cy="95" rx="10" ry="18" fill="url(#pigDark)" opacity="0.4" transform="rotate(-20 162 95)" />

      {/* Head/Snout area - left side */}
      <ellipse cx="110" cy="165" rx="45" ry="40" fill="url(#pigBody)" />
      
      {/* Snout rectangle */}
      <rect x="60" y="145" width="50" height="40" rx="8" fill="url(#pigBody)" />
      <rect x="65" y="150" width="40" height="30" rx="6" fill="url(#pigDark)" opacity="0.2" />
      
      {/* Nostrils */}
      <circle cx="75" cy="165" r="4" fill="#8B5A3C" opacity="0.6" />
      <circle cx="90" cy="165" r="4" fill="#8B5A3C" opacity="0.6" />
      
      {/* Eye */}
      <circle cx="125" cy="145" r="6" fill="#8B5A3C" />

      {/* Front left leg */}
      <rect x="155" y="260" width="30" height="50" rx="15" fill="url(#pigBody)" />
      
      {/* Front right leg */}
      <rect x="215" y="260" width="30" height="50" rx="15" fill="url(#pigBody)" />

      {/* Curly tail on right */}
      <path
        d="M 290 150 Q 310 145 325 155 Q 340 165 335 180 Q 330 190 320 185"
        stroke="url(#pigBody)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 292 150 Q 310 147 323 155 Q 335 163 332 175"
        stroke="url(#pigDark)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Coin slot on top */}
      <rect
        x="180"
        y="110"
        width="50"
        height="8"
        rx="4"
        fill="#6B4423"
      />
      <rect
        x="180"
        y="108"
        width="50"
        height="3"
        rx="1.5"
        fill="#4A2F1A"
      />
    </svg>
  );
};
