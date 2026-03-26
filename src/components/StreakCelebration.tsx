import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

const StreakCelebration: React.FC = () => {
  const { streak, badges, earnBadge } = useStore();
  const [show, setShow] = useState(false);
  const [celebratedStreak, setCelebratedStreak] = useState(0);

  useEffect(() => {
    if (streak >= 7 && streak !== celebratedStreak && !badges.find(b => b.id === 'streak-7')) {
      setShow(true);
      setCelebratedStreak(streak);
      earnBadge({
        id: 'streak-7',
        name: 'Week Warrior',
        description: '7-day streak achieved!',
        icon: '🔥',
      });
      setTimeout(() => setShow(false), 5000);
    }
  }, [streak, celebratedStreak, badges, earnBadge]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--amber))', 'hsl(var(--rose))', 'hsl(var(--mint))', '#FFD700', '#FF6B6B'][i % 7],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 50,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 1080 - 540,
                  x: (Math.random() - 0.5) * 300,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'easeOut',
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>

          {/* Badge popup */}
          <motion.div
            className="fixed inset-0 z-[99] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-3xl p-8 text-center pointer-events-auto border border-border max-w-sm mx-4"
              style={{ boxShadow: 'var(--shadow-lg)' }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                🔥
              </motion.div>
              <h2 className="text-2xl font-black mb-2">Week Warrior! 🎉</h2>
              <p className="text-muted-foreground mb-1">You've maintained a {streak}-day streak!</p>
              <p className="text-sm font-semibold" style={{ color: 'hsl(var(--accent))' }}>Badge Unlocked!</p>
              <button onClick={() => setShow(false)} className="btn-primary mt-4">Awesome! 🙌</button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StreakCelebration;
