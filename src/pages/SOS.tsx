import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

const SOS: React.FC = () => {
  const { addSOSEvent, addXP } = useStore();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'breathe' | 'done'>('breathe');
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [contactModal, setContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const totalBreaths = 5;

  useEffect(() => {
    addSOSEvent();
  }, [addSOSEvent]);

  useEffect(() => {
    if (phase !== 'breathe') return;
    const cycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => {
        setBreathPhase('exhale');
        setTimeout(() => {
          setBreathCount(prev => {
            const next = prev + 1;
            if (next >= totalBreaths) {
              setPhase('done');
              return next;
            }
            return next;
          });
        }, 4000);
      }, 7000);
    };
    cycle();
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleAlert = useCallback(() => {
    if (contactName.trim()) {
      setContactModal(false);
      alert(`Alert sent to ${contactName}! (Demo mode)`);
    }
  }, [contactName]);

  const accentH = getComputedStyle(document.documentElement).getPropertyValue('--accent-h').trim() || '170';
  const accentS = getComputedStyle(document.documentElement).getPropertyValue('--accent-s').trim() || '48%';
  const accentL = getComputedStyle(document.documentElement).getPropertyValue('--accent-l').trim() || '33%';

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
      {phase === 'breathe' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-8">Breath {Math.min(breathCount + 1, totalBreaths)} of {totalBreaths}</p>

          {/* Breathing Orb */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <motion.div
              className="absolute w-full h-full rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, hsla(${accentH}, ${accentS}, ${accentL}, 0.4), transparent)` }}
              animate={breathPhase === 'inhale' ? { scale: [0.6, 1.3] } : breathPhase === 'hold' ? { scale: 1.3 } : { scale: [1.3, 0.6] }}
              transition={{ duration: breathPhase === 'hold' ? 3 : 4, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-40 h-40 rounded-full"
              style={{ background: `radial-gradient(circle, hsl(${accentH}, ${accentS}, ${accentL}), hsl(var(--secondary)))` }}
              animate={breathPhase === 'inhale' ? { scale: [0.7, 1.2] } : breathPhase === 'hold' ? { scale: 1.2 } : { scale: [1.2, 0.7] }}
              transition={{ duration: breathPhase === 'hold' ? 3 : 4, ease: 'easeInOut' }}
            />
            <motion.span
              className="absolute text-white text-xl font-bold"
              key={breathPhase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {breathPhase === 'inhale' ? 'Breathe In' : breathPhase === 'hold' ? 'Hold' : 'Breathe Out'}
            </motion.span>
          </div>

          <div className="flex gap-1.5">
            {Array.from({ length: totalBreaths }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < breathCount ? 'accent-gradient' : 'bg-muted'}`} />
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <p className="text-4xl">🌟</p>
          <h2 className="text-2xl font-bold">Great job!</h2>
          <p className="text-muted-foreground">You completed the breathing exercise. You'll receive +50 XP tomorrow.</p>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/chat')} className="btn-primary">💬 Talk to AI</button>
            <button onClick={() => setContactModal(true)} className="btn-secondary">🚨 Alert My Person</button>
            <button onClick={() => { setPhase('breathe'); setBreathCount(0); }} className="btn-ghost">🔄 Do it again</button>
          </div>
        </motion.div>
      )}

      {/* Contact Modal */}
      {contactModal && (
        <>
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50" onClick={() => setContactModal(false)} />
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-sm rounded-2xl p-6 bg-card"
            style={{ x: '-50%', y: '-50%', boxShadow: 'var(--shadow-lg)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-bold mb-4">Alert Contact</h3>
            <input
              type="text"
              placeholder="Contact name..."
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="input-field mb-4"
            />
            <button onClick={handleAlert} className="btn-primary w-full">Send Alert (Demo)</button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SOS;
