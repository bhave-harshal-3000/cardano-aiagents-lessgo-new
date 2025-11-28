import { motion } from 'framer-motion';
import { ArrowRight, Shield, TrendingUp, Zap, Brain, Lock, BarChart3 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced agents analyze your spending patterns and provide intelligent recommendations.',
    },
    {
      icon: Shield,
      title: 'Cardano Secured',
      description: 'On-chain proof storage ensures transparency and immutability of your financial decisions.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by Hydra L2 for instant transactions and real-time budget optimization.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data remains yours. Control what you share with AI agents.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Budgeting',
      description: 'Dynamic budget adjustments based on your goals and spending behavior.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Beautiful charts and insights to understand your financial health at a glance.',
    },
  ];

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        {/* Hero Section */}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '120px 24px 80px',
            background: 'linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)',
          }}
        >
          {/* Animated background elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
            }}
          />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textAlign: 'center', marginBottom: '48px' }}
            >
              <motion.h1
                style={{
                  fontSize: '64px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  lineHeight: '1.1',
                }}
              >
                AI-Powered Finance
                <br />
                <span style={{ color: 'var(--color-primary)' }}>Secured by Cardano</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                  fontSize: '20px',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '700px',
                  margin: '0 auto 48px',
                  lineHeight: '1.6',
                }}
              >
                Track expenses, optimize budgets, and secure your financial decisions on-chain.
                Let intelligent agents guide you towards better financial health.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => navigate('/onboard')}
                >
                  Start Tracking
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={Shield}
                  onClick={() => {
                    // Wallet connect logic will be handled here
                    alert('Wallet connection coming soon!');
                  }}
                >
                  Connect Cardano Wallet
                </Button>
              </motion.div>
            </motion.div>

            {/* Demo Screenshot Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: '24px',
                maxWidth: '1000px',
                margin: '0 auto',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-tertiary)',
                  fontSize: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  Dashboard Preview
                </motion.div>
                {/* Animated lines for demo effect */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 500, opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'linear',
                    }}
                    style={{
                      position: 'absolute',
                      width: '100px',
                      height: '2px',
                      background: `linear-gradient(90deg, transparent, var(--color-primary), transparent)`,
                      top: `${20 + i * 15}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '80px 24px', background: 'var(--color-bg-primary)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: '40px',
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: '64px',
              }}
            >
              Everything you need for{' '}
              <span style={{ color: 'var(--color-accent)' }}>smart finance</span>
            </motion.h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: '56px',
                        height: '56px',
                        background: 'var(--color-primary-muted)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <feature.icon size={28} />
                    </motion.div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            padding: '80px 24px',
            background: 'var(--color-bg-secondary)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '40px',
                fontWeight: '700',
                marginBottom: '24px',
              }}
            >
              Ready to take control?
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'var(--color-text-secondary)',
                marginBottom: '40px',
                lineHeight: '1.6',
              }}
            >
              Start tracking your expenses and let AI help you build better financial habits.
              No credit card required. Connect your Cardano wallet or continue as a guest.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="accent" size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/onboard')}>
                Get Started Free
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </AnimatedPage>
  );
};
