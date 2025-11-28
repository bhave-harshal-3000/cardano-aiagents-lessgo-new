import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MessageCircle, Sparkles, TrendingUp, AlertTriangle, ThumbsDown } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';

interface Insight {
  id: string;
  agentName: string;
  timestamp: string;
  summary: string;
  confidence: number;
  category: 'optimization' | 'warning' | 'opportunity';
  fullExplanation: string;
  status: 'pending' | 'accepted' | 'dismissed';
}

export const Insights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      agentName: 'Budget Planner v1',
      timestamp: '2024-11-28 14:30',
      summary: 'Reduce dining out by 15% to meet your savings goal',
      confidence: 92,
      category: 'optimization',
      fullExplanation:
        'Based on your spending patterns over the last 3 months, you spend an average of $842/month on dining. By reducing this to $715, you can redirect $127/month to savings, helping you reach your $2000 savings goal 2 months earlier.',
      status: 'pending',
    },
    {
      id: '2',
      agentName: 'Savings Maximizer',
      timestamp: '2024-11-27 09:15',
      summary: 'Switch to annual Netflix subscription to save $24/year',
      confidence: 100,
      category: 'opportunity',
      fullExplanation:
        'Your monthly Netflix subscription costs $15.99. By switching to an annual plan at $167.88, you save $24/year. This small change compounds over time.',
      status: 'accepted',
    },
    {
      id: '3',
      agentName: 'Fraud Detector',
      timestamp: '2024-11-26 18:45',
      summary: 'Unusual transaction detected: $450 at electronics store',
      confidence: 78,
      category: 'warning',
      fullExplanation:
        'A transaction of $450 at "TechMart Electronics" was detected, which is 3x your average electronics spend. If this was unauthorized, please report it immediately.',
      status: 'dismissed',
    },
    {
      id: '4',
      agentName: 'Investment Advisor',
      timestamp: '2024-11-25 11:20',
      summary: 'Consider allocating 10% of savings to index funds',
      confidence: 85,
      category: 'opportunity',
      fullExplanation:
        'You have $1523 in savings with minimal returns. Allocating 10% ($152) to a low-cost index fund could yield 7-10% annual returns, significantly boosting long-term wealth.',
      status: 'pending',
    },
    {
      id: '5',
      agentName: 'Tax Optimizer',
      timestamp: '2024-11-24 16:00',
      summary: 'You may be eligible for a $500 education tax credit',
      confidence: 88,
      category: 'opportunity',
      fullExplanation:
        'Based on your profile as a student with $450 in education expenses this quarter, you may qualify for the American Opportunity Tax Credit, worth up to $500.',
      status: 'pending',
    },
  ]);

  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showClarify, setShowClarify] = useState(false);

  const handleAction = (id: string, action: 'accept' | 'dismiss') => {
    setInsights(insights.map((i) => (i.id === id ? { ...i, status: action === 'accept' ? 'accepted' : 'dismissed' } : i)));
  };

  const categoryColors = {
    optimization: { bg: 'var(--color-primary-muted)', color: 'var(--color-primary)', icon: TrendingUp },
    warning: { bg: 'var(--color-warning-muted)', color: 'var(--color-warning)', icon: AlertTriangle },
    opportunity: { bg: 'var(--color-accent-muted)', color: 'var(--color-accent)', icon: Sparkles },
  };

  return (
    <AnimatedPage>
      <TopBar />
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>AI Insights</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            Review recommendations from your AI agents
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Pending', value: insights.filter((i) => i.status === 'pending').length, color: 'var(--color-primary)' },
              { label: 'Accepted', value: insights.filter((i) => i.status === 'accepted').length, color: 'var(--color-accent)' },
              { label: 'Dismissed', value: insights.filter((i) => i.status === 'dismissed').length, color: 'var(--color-text-tertiary)' },
            ].map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + index * 0.1 }}>
                <Card>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{stat.label}</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div
            style={{
              position: 'absolute',
              left: '24px',
              top: '40px',
              bottom: '40px',
              width: '2px',
              background: 'var(--color-border)',
            }}
          />

          {insights.map((insight, index) => {
            const categoryStyle = categoryColors[insight.category];
            const Icon = categoryStyle.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{ position: 'relative', marginBottom: '24px' }}
              >
                {/* Timeline dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '32px',
                    width: '16px',
                    height: '16px',
                    background: categoryStyle.color,
                    borderRadius: '50%',
                    border: '3px solid var(--color-bg-primary)',
                    zIndex: 1,
                  }}
                />

                <div style={{ marginLeft: '60px' }}>
                  <Card hover={insight.status === 'pending'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <div
                            style={{
                              padding: '4px 12px',
                              background: categoryStyle.bg,
                              color: categoryStyle.color,
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Icon size={14} />
                            {insight.category.toUpperCase()}
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{insight.agentName}</span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>•</span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{insight.timestamp}</span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{insight.summary}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              height: '6px',
                              flex: 1,
                              maxWidth: '200px',
                              background: 'var(--color-surface)',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${insight.confidence}%`,
                                background: categoryStyle.color,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: categoryStyle.color }}>
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>

                      {insight.status !== 'pending' && (
                        <div
                          style={{
                            padding: '6px 12px',
                            background: insight.status === 'accepted' ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                            color: insight.status === 'accepted' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {insight.status === 'accepted' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {insight.status.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {insight.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button
                          variant="accent"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleAction(insight.id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={XCircle}
                          onClick={() => handleAction(insight.id, 'dismiss')}
                        >
                          Dismiss
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={MessageCircle}
                          onClick={() => {
                            setSelectedInsight(insight);
                            setShowClarify(true);
                          }}
                        >
                          Ask for Clarification
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInsight(insight);
                            setShowExplanation(true);
                          }}
                        >
                          View Full Explanation
                        </Button>
                      </div>
                    )}

                    {insight.status === 'dismissed' && (
                      <Button variant="ghost" size="sm" icon={ThumbsDown}>
                        Report False Suggestion
                      </Button>
                    )}
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Explanation Modal */}
        <Modal isOpen={showExplanation} onClose={() => setShowExplanation(false)} title="Full Explanation" width="lg">
          {selectedInsight && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Agent: {selectedInsight.agentName}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{selectedInsight.summary}</h3>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                {selectedInsight.fullExplanation}
              </p>
              <Button variant="primary" fullWidth onClick={() => setShowExplanation(false)}>
                Close
              </Button>
            </div>
          )}
        </Modal>

        {/* Clarification Modal */}
        <Modal isOpen={showClarify} onClose={() => setShowClarify(false)} title="Ask for Clarification" width="md">
          {selectedInsight && (
            <div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Ask the agent to provide more details or clarify specific aspects of this recommendation:
              </p>
              <textarea
                placeholder="What would you like to know more about?"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  marginBottom: '16px',
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="outline" fullWidth onClick={() => setShowClarify(false)}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={() => setShowClarify(false)}>
                  Send Question
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AnimatedPage>
  );
};
