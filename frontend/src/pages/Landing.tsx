import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Shield, Zap, Lock, TrendingUp, BarChart3 } from 'lucide-react';
import {
  FallingCurrency,
  FloatingNumbers,
  GlowingParticles,
  ScanningLight,
  TypewriterText,
} from '../components';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(true);
  const [count, setCount] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Counting animation for savings
  useEffect(() => {
    const duration = 2000;
    const target = 100;
    const increment = target / (duration / 50);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const receiptStyles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fafaf8 0%, #f0f0ea 100%)',
      fontFamily: "'Courier Prime', 'Courier New', Courier, monospace",
      position: 'relative' as const,
      color: '#000000',
    },
    paperTexture: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          rgba(0,0,0,0.02) 0px,
          transparent 1px,
          transparent 2px,
          rgba(0,0,0,0.02) 3px
        )
      `,
      pointerEvents: 'none' as const,
      zIndex: 1,
    },
    nav: {
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px dashed rgba(0,0,0,0.1)',
      position: 'relative' as const,
      zIndex: 10,
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(10px)',
      color: '#000000',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold' as const,
      letterSpacing: '3px',
      color: '#000000',
    },
    navLinks: {
      display: 'flex',
      gap: '32px',
      fontSize: '14px',
      letterSpacing: '1px',
      color: '#000000',
    },
    navLink: {
      cursor: 'pointer',
      opacity: 0.7,
      transition: 'opacity 0.3s',
      color: '#000000',
    },
    hero: {
      textAlign: 'center' as const,
      padding: '100px 40px',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative' as const,
      zIndex: 2,
      color: '#000000',
    },
    receiptHeader: {
      fontSize: '12px',
      letterSpacing: '2px',
      opacity: 0.5,
      marginBottom: '16px',
      color: '#000000',
    },
    mainTitle: {
      fontSize: '64px',
      fontWeight: 'bold' as const,
      letterSpacing: '4px',
      marginBottom: '24px',
      lineHeight: '1.1',
      color: '#000000',
    },
    subtitle: {
      fontSize: '20px',
      opacity: 0.7,
      marginBottom: '16px',
      letterSpacing: '1px',
      color: '#000000',
    },
    sessionInfo: {
      fontSize: '12px',
      opacity: 0.4,
      marginBottom: '48px',
      letterSpacing: '1px',
      color: '#000000',
    },
    divider: {
      borderTop: '2px dashed rgba(0,0,0,0.15)',
      margin: '40px auto',
      maxWidth: '600px',
    },
    ctaContainer: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      marginTop: '48px',
    },
    primaryButton: {
      padding: '18px 48px',
      background: '#000',
      color: '#fff',
      border: '3px solid #000',
      fontSize: '16px',
      fontFamily: "'Courier New', Courier, monospace",
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      letterSpacing: '2px',
      transition: 'all 0.3s',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    secondaryButton: {
      padding: '18px 48px',
      background: 'transparent',
      color: '#000',
      border: '3px solid #000',
      fontSize: '16px',
      fontFamily: "'Courier New', Courier, monospace",
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      letterSpacing: '2px',
      transition: 'all 0.3s',
    },
    featuresSection: {
      padding: '100px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative' as const,
      zIndex: 2,
    },
    sectionTitle: {
      fontSize: '40px',
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      marginBottom: '24px',
      letterSpacing: '3px',
      color: '#000000',
    },
    sectionSubtitle: {
      fontSize: '16px',
      textAlign: 'center' as const,
      opacity: 0.6,
      marginBottom: '80px',
      letterSpacing: '1px',
      color: '#000000',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '32px',
      marginTop: '60px',
    },
    featureCard: {
      background: '#fff',
      padding: '40px 32px',
      border: '2px solid rgba(0,0,0,0.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.3s',
      position: 'relative' as const,
      color: '#000000',
    },
    featureIcon: {
      width: '56px',
      height: '56px',
      background: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: 'bold' as const,
      marginBottom: '12px',
      letterSpacing: '1px',
      color: '#000000',
    },
    featureDescription: {
      fontSize: '14px',
      lineHeight: '1.7',
      opacity: 0.7,
      color: '#000000',
    },
    featurePrice: {
      fontSize: '18px',
      fontWeight: 'bold' as const,
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px dashed rgba(0,0,0,0.2)',
      color: '#000000',
    },
    statsSection: {
      padding: '100px 40px',
      background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
      borderTop: '3px double rgba(0,0,0,0.2)',
      borderBottom: '3px double rgba(0,0,0,0.2)',
      position: 'relative' as const,
      zIndex: 2,
      color: '#000000',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '32px',
      maxWidth: '1100px',
      margin: '0 auto',
      textAlign: 'center' as const,
      color: '#000000',
    },
    statNumber: {
      fontSize: '64px',
      fontWeight: '900' as const,
      marginBottom: '12px',
      color: '#000000',
      lineHeight: '1',
      fontFamily: 'monospace',
    },
    statLabel: {
      fontSize: '12px',
      opacity: 0.7,
      letterSpacing: '2px',
      color: '#000000',
      fontWeight: '600' as const,
      marginTop: '8px',
    },
    footer: {
      padding: '60px 40px 40px',
      textAlign: 'center' as const,
      position: 'relative' as const,
      zIndex: 2,
      color: '#000000',
    },
    footerMessage: {
      fontSize: '20px',
      marginBottom: '24px',
      letterSpacing: '1px',
      color: '#000000',
    },
    footerLinks: {
      display: 'flex',
      gap: '24px',
      justifyContent: 'center',
      fontSize: '16px',
      opacity: 0.6,
      marginBottom: '24px',
      color: '#000000',
    },
    footerLink: {
      cursor: 'pointer',
      transition: 'opacity 0.3s',
      color: '#000000',
    },
    barcode: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2px',
      margin: '32px auto 24px',
      height: '50px',
      maxWidth: '300px',
    },
  };

  const features = [
    {
      icon: Brain,
      title: 'AI INSIGHTS',
      description: 'Advanced machine learning analyzes your spending patterns and provides intelligent recommendations.',
      price: 'INCLUDED',
    },
    {
      icon: Shield,
      title: 'CARDANO SECURITY',
      description: 'Blockchain-backed proof storage ensures transparency and immutability of financial decisions.',
      price: 'INCLUDED',
    },
    {
      icon: Zap,
      title: 'HYDRA SPEED',
      description: 'Powered by Hydra L2 for instant transactions and real-time budget optimization.',
      price: 'INCLUDED',
    },
    {
      icon: Lock,
      title: 'PRIVACY FIRST',
      description: 'Your financial data remains private. You control what gets shared with AI agents.',
      price: 'INCLUDED',
    },
    {
      icon: TrendingUp,
      title: 'SMART BUDGETING',
      description: 'Dynamic budget adjustments based on your financial goals and spending behavior.',
      price: 'INCLUDED',
    },
    {
      icon: BarChart3,
      title: 'VISUAL ANALYTICS',
      description: 'Beautiful charts and insights to understand your financial health at a glance.',
      price: 'INCLUDED',
    },
  ];

  const printRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const slideInVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <div style={receiptStyles.page}>
      {/* Paper texture overlay */}
      <div style={receiptStyles.paperTexture} />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={receiptStyles.nav}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo.png"
            alt="FinanceBot Logo"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
            }}
          />
          <div style={receiptStyles.logo}>FinanceBot</div>
        </div>
        <div style={receiptStyles.navLinks}>
          <motion.span
            style={receiptStyles.navLink}
            whileHover={{ opacity: 1 }}
            onClick={() => navigate('/about')}
          >
            ABOUT
          </motion.span>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{
          ...receiptStyles.hero,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Parallax Background Effects */}
        <motion.div style={{ y, opacity }}>
          <GlowingParticles />
          <FallingCurrency />
          <FloatingNumbers />
        </motion.div>

        {/* Centered Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <img
            src="/logo.png"
            alt="FinanceBot Logo"
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
            }}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={printRevealVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={receiptStyles.receiptHeader}>
            POWERED BY CARDANO BLOCKCHAIN
          </div>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={printRevealVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={receiptStyles.mainTitle}
        >
          <TypewriterText text="FinanceBot" delay={300} speed={120} />
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={printRevealVariants}
          transition={{ duration: 0.5, delay: 1.5 }}
          style={receiptStyles.subtitle}
        >
          AI-POWERED EXPENSE TRACKING
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={printRevealVariants}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={receiptStyles.sessionInfo}
        >
          SESSION #{String(Math.floor(Math.random() * 1000)).padStart(4, '0')} •{' '}
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </motion.div>

        <div style={receiptStyles.divider} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={printRevealVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={receiptStyles.ctaContainer}
        >
          <motion.button
            style={receiptStyles.primaryButton}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(0,0,0,0.4), 0 0 60px rgba(0,0,0,0.2)',
              y: -4,
            }}
            whileTap={{ scale: 0.95, y: 0 }}
            onClick={() => navigate('/onboard')}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 15px rgba(255,255,255,0.6)',
                  '0 0 0px rgba(255,255,255,0)',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              START TRACKING →
            </motion.span>
          </motion.button>

          <motion.button
            style={receiptStyles.secondaryButton}
            whileHover={{
              scale: 1.05,
              background: '#000',
              color: '#fff',
              y: -4,
            }}
            whileTap={{ scale: 0.95, y: 0 }}
            onClick={() => navigate('/onboard')}
          >
            CONNECT WALLET 🔐
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={receiptStyles.statsSection}
      >
        <div style={receiptStyles.statsGrid}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              padding: '40px 24px',
              background: '#fff',
              border: '2px dashed rgba(0,0,0,0.15)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <ScanningLight>
              <div style={receiptStyles.statNumber}>{count}%</div>
              <div style={{ height: '2px', width: '60px', background: 'rgba(0,0,0,0.2)', margin: '16px auto' }}></div>
              <div style={receiptStyles.statLabel}>AVERAGE SAVINGS</div>
            </ScanningLight>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              padding: '40px 24px',
              background: '#fff',
              border: '2px dashed rgba(0,0,0,0.15)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <ScanningLight>
              <div style={receiptStyles.statNumber}>$0</div>
              <div style={{ height: '2px', width: '60px', background: 'rgba(0,0,0,0.2)', margin: '16px auto' }}></div>
              <div style={receiptStyles.statLabel}>SETUP COST</div>
            </ScanningLight>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              padding: '40px 24px',
              background: '#fff',
              border: '2px dashed rgba(0,0,0,0.15)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <ScanningLight>
              <div style={receiptStyles.statNumber}>24/7</div>
              <div style={{ height: '2px', width: '60px', background: 'rgba(0,0,0,0.2)', margin: '16px auto' }}></div>
              <div style={receiptStyles.statLabel}>AI MONITORING</div>
            </ScanningLight>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              padding: '40px 24px',
              background: '#fff',
              border: '2px dashed rgba(0,0,0,0.15)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <ScanningLight>
              <div style={receiptStyles.statNumber}>∞</div>
              <div style={{ height: '2px', width: '60px', background: 'rgba(0,0,0,0.2)', margin: '16px auto' }}></div>
              <div style={receiptStyles.statLabel}>BLOCKCHAIN SECURITY</div>
            </ScanningLight>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={receiptStyles.featuresSection}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={receiptStyles.sectionTitle}>FEATURES & BENEFITS</h2>
          <p style={receiptStyles.sectionSubtitle}>
            ━━━━━━━━━━━ Everything included at no cost ━━━━━━━━━━━
          </p>
        </motion.div>

        <div style={receiptStyles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInVariants}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              style={receiptStyles.featureCard}
              whileHover={{
                y: -12,
                boxShadow: '0 12px 32px rgba(0,0,0,0.15), 0 0 0 2px rgba(0,0,0,0.1)',
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <div style={receiptStyles.featureIcon}>
                <feature.icon size={28} />
              </div>
              <h3 style={receiptStyles.featureTitle}>{feature.title}</h3>
              <p style={receiptStyles.featureDescription}>{feature.description}</p>
              <div style={receiptStyles.featurePrice}>✓ {feature.price}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={receiptStyles.footer}
      >
        <div style={receiptStyles.divider} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={receiptStyles.footerMessage}>
            THANK YOU FOR MANAGING MONEY SMARTLY
          </div>

          <div style={receiptStyles.footerLinks}>
            <span style={receiptStyles.footerLink}>About</span>
            <span>•</span>
            <span style={receiptStyles.footerLink}>Features</span>
            <span>•</span>
            <span style={receiptStyles.footerLink}>Contact</span>
            <span>•</span>
            <span style={receiptStyles.footerLink}>Privacy</span>
            <span>•</span>
            <span style={receiptStyles.footerLink}>Terms</span>
          </div>

          {/* Barcode */}
          <div style={receiptStyles.barcode}>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                style={{
                  width: Math.random() > 0.5 ? '4px' : '2px',
                  background: '#000',
                  height: '100%',
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '12px', opacity: 0.4, marginTop: '24px' }}>
            BLOCKCHAIN VERIFIED • TX ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}
            {showCursor && <span style={{ fontSize: '14px', marginLeft: '4px' }}>█</span>}
          </div>

          <div style={{ fontSize: '11px', opacity: 0.3, marginTop: '16px' }}>
            © 2025 FinanceBot • All Rights Reserved
          </div>
        </motion.div>
      </motion.footer>
    </div>
  );
};
