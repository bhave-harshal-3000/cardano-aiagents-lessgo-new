import { motion } from 'framer-motion';
import { Sparkles, Star, Shield, TrendingUp, Zap, Power } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';

interface Agent {
  id: string;
  name: string;
  description: string;
  provider: string;
  price: number;
  rating: number;
  enabled: boolean;
  verified: boolean;
  category: string;
}

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Budget Planner v1',
      description: 'Analyzes spending patterns and suggests optimal budget allocation based on your financial goals.',
      provider: 'Masumi AI',
      price: 0,
      rating: 4.8,
      enabled: true,
      verified: true,
      category: 'Planning',
    },
    {
      id: '2',
      name: 'Expense Classifier',
      description: 'Automatically categorizes transactions with high accuracy using machine learning.',
      provider: 'Sōkosumi',
      price: 0,
      rating: 4.9,
      enabled: true,
      verified: true,
      category: 'Classification',
    },
    {
      id: '3',
      name: 'Savings Maximizer',
      description: 'Identifies opportunities to increase savings without compromising your lifestyle.',
      provider: 'FinanceAI',
      price: 5,
      rating: 4.7,
      enabled: false,
      verified: true,
      category: 'Optimization',
    },
    {
      id: '4',
      name: 'Investment Advisor',
      description: 'Provides personalized investment recommendations based on your risk profile and goals.',
      provider: 'Masumi AI',
      price: 10,
      rating: 4.6,
      enabled: false,
      verified: true,
      category: 'Investment',
    },
    {
      id: '5',
      name: 'Fraud Detector',
      description: 'Monitors transactions for suspicious activity and alerts you to potential fraud.',
      provider: 'SecureAI',
      price: 3,
      rating: 4.9,
      enabled: false,
      verified: true,
      category: 'Security',
    },
    {
      id: '6',
      name: 'Tax Optimizer',
      description: 'Analyzes your finances to find tax-saving opportunities and deductions.',
      provider: 'TaxAI Pro',
      price: 15,
      rating: 4.5,
      enabled: false,
      verified: false,
      category: 'Tax',
    },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [useHydra, setUseHydra] = useState(true);

  const toggleAgent = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    if (agent && agent.price > 0 && !agent.enabled) {
      setSelectedAgent(agent);
      setShowPaymentModal(true);
    } else {
      setAgents(agents.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
    }
  };

  const handlePayment = () => {
    if (selectedAgent) {
      setAgents(agents.map((a) => (a.id === selectedAgent.id ? { ...a, enabled: true } : a)));
      setShowPaymentModal(false);
      setSelectedAgent(null);
    }
  };

  const categoryIcons: Record<string, any> = {
    Planning: TrendingUp,
    Classification: Sparkles,
    Optimization: Zap,
    Investment: Star,
    Security: Shield,
    Tax: Star,
  };

  return (
    <AnimatedPage>
      <TopBar />
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Agent Marketplace</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            Discover and enable AI agents to enhance your financial management
          </p>
        </motion.div>

        {/* Active Agents Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '32px' }}>
          <Card>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Active Agents</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {agents
                .filter((a) => a.enabled)
                .map((agent) => {
                  const Icon = categoryIcons[agent.category] || Sparkles;
                  return (
                    <motion.div
                      key={agent.id}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        padding: '12px 20px',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'var(--color-accent-muted)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-accent)',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{agent.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{agent.provider}</div>
                      </div>
                    </motion.div>
                  );
                })}
              {agents.filter((a) => a.enabled).length === 0 && (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  No active agents. Enable agents below to get started.
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Agent Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
          }}
        >
          {agents.map((agent, index) => {
            const Icon = categoryIcons[agent.category] || Sparkles;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card hover>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: agent.enabled ? 'var(--color-accent-muted)' : 'var(--color-primary-muted)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: agent.enabled ? 'var(--color-accent)' : 'var(--color-primary)',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {agent.verified && (
                        <div
                          style={{
                            padding: '4px 8px',
                            background: 'var(--color-primary-muted)',
                            color: 'var(--color-primary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Shield size={12} />
                          Verified
                        </div>
                      )}
                      <div
                        style={{
                          padding: '4px 8px',
                          background: agent.price === 0 ? 'var(--color-accent-muted)' : 'var(--color-warning-muted)',
                          color: agent.price === 0 ? 'var(--color-accent)' : 'var(--color-warning)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {agent.price === 0 ? 'Free' : `$${agent.price}/mo`}
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{agent.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: '1.6' }}>
                    {agent.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={16} style={{ fill: 'var(--color-warning)', color: 'var(--color-warning)' }} />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{agent.rating}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>by {agent.provider}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                      variant={agent.enabled ? 'outline' : 'primary'}
                      size="sm"
                      fullWidth
                      icon={Power}
                      onClick={() => toggleAgent(agent.id)}
                    >
                      {agent.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    {agent.enabled && (
                      <Button variant="accent" size="sm" fullWidth icon={Sparkles}>
                        Use Now
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Modal */}
        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Enable Premium Agent" width="md">
          {selectedAgent && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{selectedAgent.name}</h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  {selectedAgent.description}
                </p>
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Subscription:</span>
                    <span style={{ fontWeight: '600' }}>${selectedAgent.price}/month</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Provider:</span>
                    <span style={{ fontWeight: '600' }}>{selectedAgent.provider}</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px',
                    background: 'var(--color-primary-muted)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={useHydra}
                    onChange={(e) => setUseHydra(e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>Use Hydra L2</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Instant payment confirmation with lower fees
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="outline" fullWidth onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={handlePayment}>
                  Enable & Pay
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AnimatedPage>
  );
};
