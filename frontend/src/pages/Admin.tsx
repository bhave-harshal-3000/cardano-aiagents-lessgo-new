import { motion } from 'framer-motion';
import { Search, ExternalLink, Shield, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Card } from '../components/Card';
import { TopBar } from '../components/TopBar';

interface AgentLog {
  id: string;
  jobId: string;
  provider: string;
  agentName: string;
  timestamp: string;
  inputSnapshot: string;
  recommendation: string;
  accepted: boolean;
}

interface BlockchainLog {
  id: string;
  txHash: string;
  type: string;
  timestamp: string;
  dataHash: string;
  status: string;
}

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'blockchain'>('agents');
  const [searchTerm, setSearchTerm] = useState('');

  const agentLogs: AgentLog[] = [
    {
      id: '1',
      jobId: 'job_a8k2j9x1',
      provider: 'Masumi AI',
      agentName: 'Budget Planner v1',
      timestamp: '2024-11-28 14:30:22',
      inputSnapshot: 'Monthly spend: $2847, Categories: 5, Income: $3500',
      recommendation: 'Reduce dining by 15% to increase savings',
      accepted: true,
    },
    {
      id: '2',
      jobId: 'job_b3m7n4x8',
      provider: 'Sōkosumi',
      agentName: 'Expense Classifier',
      timestamp: '2024-11-28 09:15:44',
      inputSnapshot: 'Transaction: "Whole Foods Market", Amount: $87.45',
      recommendation: 'Category: Food & Dining (95% confidence)',
      accepted: true,
    },
    {
      id: '3',
      jobId: 'job_c5p1q8y3',
      provider: 'FinanceAI',
      agentName: 'Savings Maximizer',
      timestamp: '2024-11-27 16:45:11',
      inputSnapshot: 'Current savings: $1523, Monthly surplus: $200',
      recommendation: 'Allocate 10% to index funds for better returns',
      accepted: false,
    },
  ];

  const blockchainLogs: BlockchainLog[] = [
    {
      id: '1',
      txHash: '8a3f2e1d9c7b6a5e4f3d2c1b0a9e8d7c6b5a4e3f2d1c0b9a8e7d6c5b4a3f2e1d',
      type: 'Budget Snapshot',
      timestamp: '2024-11-28 15:22:33',
      dataHash: 'sha256:9e8d7c6b5a4e3f2d1c0b9a8e7d6c5b4a3f2e1d0c9b8a7e6d5c4b3a2f1e0d9c8',
      status: 'Confirmed',
    },
    {
      id: '2',
      txHash: '7b4e3f2d1c0b9a8e7d6c5b4a3f2e1d0c9b8a7e6d5c4b3a2f1e0d9c8b7a6e5f4',
      type: 'Agent Payment',
      timestamp: '2024-11-27 11:10:05',
      dataHash: 'sha256:8d7c6b5a4e3f2d1c0b9a8e7d6c5b4a3f2e1d0c9b8a7e6d5c4b3a2f1e0d9c8b',
      status: 'Confirmed',
    },
    {
      id: '3',
      txHash: '6c5b4a3f2e1d0c9b8a7e6d5c4b3a2f1e0d9c8b7a6e5f4e3d2c1b0a9e8d7c6b5',
      type: 'Monthly Summary',
      timestamp: '2024-11-26 23:59:59',
      dataHash: 'sha256:7c6b5a4e3f2d1c0b9a8e7d6c5b4a3f2e1d0c9b8a7e6d5c4b3a2f1e0d9c8b7a',
      status: 'Confirmed',
    },
  ];

  const filteredAgentLogs = agentLogs.filter((log) =>
    log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.jobId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlockchainLogs = blockchainLogs.filter((log) =>
    log.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <TopBar />
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Admin Panel</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            View agent execution logs and blockchain proofs
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--color-border)' }}>
            <button
              onClick={() => setActiveTab('agents')}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                color: activeTab === 'agents' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'agents' ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-2px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} />
                Agent Logs
              </div>
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                color: activeTab === 'blockchain' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'blockchain' ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} />
                Blockchain Logs
              </div>
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ position: 'relative' }}>
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
                placeholder={activeTab === 'agents' ? 'Search by agent, provider, or job ID...' : 'Search by tx hash or type...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Agent Logs Table */}
        {activeTab === 'agents' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card padding="none">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Job ID</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Agent</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Provider</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Timestamp</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Input</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Recommendation</th>
                      <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgentLogs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            {log.jobId}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', fontWeight: '500', fontSize: '14px' }}>{log.agentName}</td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>{log.provider}</td>
                        <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{log.timestamp}</td>
                        <td style={{ padding: '16px 24px', fontSize: '13px', maxWidth: '200px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.inputSnapshot}</div>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '13px', maxWidth: '250px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.recommendation}</div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              background: log.accepted ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                              color: log.accepted ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {log.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Blockchain Logs Table */}
        {activeTab === 'blockchain' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card padding="none">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>TX Hash</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Type</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Timestamp</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Data Hash</th>
                      <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>Status</th>
                      <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>Explorer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlockchainLogs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '12px',
                              color: 'var(--color-primary)',
                            }}
                          >
                            {log.txHash.slice(0, 16)}...{log.txHash.slice(-8)}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', fontWeight: '500', fontSize: '14px' }}>{log.type}</td>
                        <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{log.timestamp}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '11px',
                              color: 'var(--color-text-tertiary)',
                            }}
                          >
                            {log.dataHash.slice(0, 24)}...
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              background: 'var(--color-accent-muted)',
                              color: 'var(--color-accent)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://cardanoscan.io/transaction/${log.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              padding: '8px',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <ExternalLink size={18} />
                          </motion.a>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};
