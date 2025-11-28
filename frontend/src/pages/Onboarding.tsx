import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Users, Briefcase, GraduationCap, Wallet as WalletIcon, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type UserType = 'student' | 'working' | 'family' | null;
type Mode = 'guest' | 'wallet' | null;

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<Mode>(null);
  const [income, setIncome] = useState('');
  const [userType, setUserType] = useState<UserType>(null);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return mode !== null;
      case 2:
        return true; // Income is optional
      case 3:
        return userType !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <AnimatedPage>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--color-bg-primary)',
        }}
      >
        <div style={{ maxWidth: '700px', width: '100%' }}>
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '48px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Step {step} of {totalSteps}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div
              style={{
                height: '4px',
                background: 'var(--color-surface)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                }}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Choose Mode */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
                  Welcome to FinanceAI
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
                  Choose how you'd like to get started. You can always connect your wallet later.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Card hover onClick={() => setMode('guest')}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
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
                          <User size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                            Continue as Guest
                          </h3>
                          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                            Start tracking immediately without wallet connection
                          </p>
                        </div>
                      </div>
                      {mode === 'guest' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '24px',
                            height: '24px',
                            background: 'var(--color-accent)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={16} color="#fff" />
                        </motion.div>
                      )}
                    </div>
                  </Card>

                  <Card hover onClick={() => setMode('wallet')}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--color-accent-muted)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-accent)',
                          }}
                        >
                          <WalletIcon size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                            Connect Cardano Wallet
                          </h3>
                          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                            Unlock on-chain features and secure storage
                          </p>
                        </div>
                      </div>
                      {mode === 'wallet' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '24px',
                            height: '24px',
                            background: 'var(--color-accent)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={16} color="#fff" />
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Step 2: Monthly Income */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
                  Monthly Income
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
                  This helps our AI provide better budget suggestions. You can skip this step if you prefer.
                </p>

                <Card>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Average monthly income (optional)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="Enter amount in USD"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '16px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                  <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
                    Your financial data is private and secure
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Step 3: User Type */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
                  Tell us about yourself
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
                  This helps us tailor recommendations to your lifestyle
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { value: 'student', icon: GraduationCap, label: 'Student', desc: 'Managing education and expenses' },
                    { value: 'working', icon: Briefcase, label: 'Working Professional', desc: 'Career-focused financial planning' },
                    { value: 'family', icon: Users, label: 'Family', desc: 'Household budget management' },
                  ].map((type) => (
                    <Card key={type.value} hover onClick={() => setUserType(type.value as UserType)}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              background: userType === type.value ? 'var(--color-accent-muted)' : 'var(--color-primary-muted)',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: userType === type.value ? 'var(--color-accent)' : 'var(--color-primary)',
                            }}
                          >
                            <type.icon size={24} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                              {type.label}
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                              {type.desc}
                            </p>
                          </div>
                        </div>
                        {userType === type.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              width: '24px',
                              height: '24px',
                              background: 'var(--color-accent)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={16} color="#fff" />
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Import or Start Fresh */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
                  Ready to begin?
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
                  Would you like to start with demo data or begin with a fresh slate?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Card hover>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      Start Fresh
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                      Begin with a clean dashboard and add your own transactions
                    </p>
                  </Card>

                  <Card hover>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      Import Demo Data
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                      Explore the platform with sample transactions and insights
                    </p>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            {step > 1 && (
              <Button variant="outline" icon={ArrowLeft} onClick={handleBack}>
                Back
              </Button>
            )}
            <Button
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleNext}
              disabled={!canProceed()}
              fullWidth={step === 1}
            >
              {step === totalSteps ? 'Complete Setup' : 'Continue'}
            </Button>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};
