import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export const PiggyBankAnimation: React.FC = () => {
  const [coins, setCoins] = useState<{ id: number }[]>([]);
  const [coinCounter, setCoinCounter] = useState(0);

  useEffect(() => {
    const intervals = [2000, 3500, 2800, 4000, 3200];
    let currentIndex = 0;
    let isActive = true;

    const addCoin = () => {
      if (!isActive) return;
      
      const id = Date.now();
      setCoins((prev) => [...prev, { id }]);
      setCoinCounter((prev) => prev + 1);

      setTimeout(() => {
        setCoins((prev) => prev.filter((coin) => coin.id !== id));
      }, 1500);

      currentIndex = (currentIndex + 1) % intervals.length;
      setTimeout(addCoin, intervals[currentIndex]);
    };

    const initialTimeout = setTimeout(addCoin, 1000);

    return () => {
      isActive = false;
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Coins dropping */}
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          initial={{ y: -80, opacity: 0, scale: 0.5 }}
          animate={{
            y: [- 80, 20],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.8],
          }}
          transition={{
            duration: 1.4,
            times: [0, 0.3, 0.7, 1],
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            marginLeft: '-12px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#f5a623',
              boxShadow: '0 4px 12px rgba(245, 166, 35, 0.5), inset -2px -2px 4px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            ₳
          </div>
        </motion.div>
      ))}

      {/* Piggy Bank - Flat 2D Design */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          width: '160px',
          height: '120px',
        }}
      >
        {/* Bounce effect */}
        <motion.div
          key={coinCounter}
          animate={
            coinCounter > 0
              ? {
                  scale: [1, 1.05, 0.98, 1],
                }
              : {}
          }
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {/* Main body - simple oval */}
          <div
            style={{
              position: 'absolute',
              width: '120px',
              height: '80px',
              background: '#ff9a9e',
              borderRadius: '50%',
              top: '20px',
              left: '20px',
              border: '3px solid #ff7882',
            }}
          >
            {/* Coin slot */}
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '35px',
                height: '5px',
                background: '#cc5a5f',
                borderRadius: '3px',
              }}
            />

            {/* Eye */}
            <div
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: '#2d2d2d',
                borderRadius: '50%',
                top: '30px',
                left: '45px',
              }}
            />

            {/* Smile */}
            <div
              style={{
                position: 'absolute',
                width: '20px',
                height: '10px',
                border: '2px solid #cc5a5f',
                borderTop: 'transparent',
                borderRadius: '0 0 20px 20px',
                top: '45px',
                left: '40px',
              }}
            />
          </div>

          {/* Snout - simple circle */}
          <div
            style={{
              position: 'absolute',
              width: '30px',
              height: '25px',
              background: '#ffc1c8',
              borderRadius: '50%',
              top: '45px',
              left: '5px',
              border: '2px solid #ff7882',
            }}
          >
            {/* Nostrils */}
            <div
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: '#cc5a5f',
                borderRadius: '50%',
                bottom: '8px',
                left: '7px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: '#cc5a5f',
                borderRadius: '50%',
                bottom: '8px',
                right: '7px',
              }}
            />
          </div>

          {/* Ear */}
          <div
            style={{
              position: 'absolute',
              width: '20px',
              height: '28px',
              background: '#ff9a9e',
              borderRadius: '50% 50% 0 0',
              top: '10px',
              left: '50px',
              border: '2px solid #ff7882',
              transform: 'rotate(-15deg)',
            }}
          />

          {/* Legs */}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '14px',
                height: '22px',
                background: '#ff9a9e',
                borderRadius: '0 0 7px 7px',
                bottom: '5px',
                left: `${40 + i * 40}px`,
                border: '2px solid #ff7882',
              }}
            />
          ))}

          {/* Curly tail */}
          <motion.div
            animate={{
              rotate: [0, 8, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              border: '4px solid #ff9a9e',
              borderRadius: '50%',
              borderTop: 'transparent',
              borderLeft: 'transparent',
              top: '30px',
              right: '15px',
              transform: 'rotate(45deg)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Sparkles */}
      {coins.map((coin) => (
        <React.Fragment key={`sparkle-${coin.id}`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [1, 0.6, 0],
                x: [0, Math.cos((i * Math.PI * 2) / 3) * 25],
                y: [0, Math.sin((i * Math.PI * 2) / 3) * 25],
              }}
              transition={{
                duration: 0.5,
                delay: 0.9,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                background: '#f5a623',
                borderRadius: '50%',
              }}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
