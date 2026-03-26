import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface ThoughtBubble {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  popped: boolean;
}

const NEGATIVE_THOUGHTS = [
  "I'm not good enough",
  "Nobody cares",
  "I'll never succeed",
  "Everything is terrible",
  "I can't do this",
  "I'm a failure",
  "It's hopeless",
  "I'm worthless",
  "Nothing matters",
  "I'll mess up",
  "They're judging me",
  "I'm all alone",
  "I can't cope",
  "It's too hard",
  "I'm stuck",
];

const ThoughtCloud: React.FC = () => {
  const { addXP } = useStore();
  const [thoughts, setThoughts] = useState<ThoughtBubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setThoughts([]);
    setTimeLeft(30);
  }, []);

  // Spawn thoughts
  useEffect(() => {
    if (!gameActive) return;
    intervalRef.current = setInterval(() => {
      const thought: ThoughtBubble = {
        id: crypto.randomUUID(),
        text: NEGATIVE_THOUGHTS[Math.floor(Math.random() * NEGATIVE_THOUGHTS.length)],
        x: 10 + Math.random() * 70,
        y: 100,
        speed: 0.5 + Math.random() * 1,
        popped: false,
      };
      setThoughts(prev => [...prev.slice(-12), thought]);
    }, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameActive]);

  // Move thoughts up
  useEffect(() => {
    if (!gameActive) return;
    const moveInterval = setInterval(() => {
      setThoughts(prev =>
        prev
          .map(t => ({ ...t, y: t.y - t.speed }))
          .filter(t => t.y > -20 && !t.popped)
      );
    }, 50);
    return () => clearInterval(moveInterval);
  }, [gameActive]);

  // Timer
  useEffect(() => {
    if (!gameActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameActive]);

  const popThought = (id: string) => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, popped: true } : t));
    setScore(prev => prev + 1);
  };

  // Award XP when game ends
  useEffect(() => {
    if (!gameActive && score > 0) {
      addXP(Math.min(score * 2, 30));
    }
  }, [gameActive, score, addXP]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Thought Cloud ☁️</h1>
      <p className="text-sm text-muted-foreground">Pop the negative thoughts before they float away! Tap them to make them disappear.</p>

      {!gameActive && timeLeft === 30 && (
        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-6xl mb-6">☁️</p>
          <p className="text-lg font-semibold mb-2">Ready to clear your mind?</p>
          <p className="text-muted-foreground mb-6">You have 30 seconds. Tap every negative thought to pop it!</p>
          <button onClick={startGame} className="btn-primary text-lg px-10 py-4">Start Game 🎮</button>
        </motion.div>
      )}

      {!gameActive && timeLeft === 0 && (
        <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <p className="text-6xl mb-4">🎉</p>
          <h2 className="text-3xl font-black mb-2">Score: {score}</h2>
          <p className="text-muted-foreground mb-2">You popped {score} negative thoughts!</p>
          <p className="text-sm text-muted-foreground mb-6">+{Math.min(score * 2, 30)} XP earned</p>
          <button onClick={startGame} className="btn-primary text-lg px-10 py-4">Play Again 🔄</button>
        </motion.div>
      )}

      {gameActive && (
        <>
          <div className="flex items-center justify-between">
            <div className="badge text-sm">Score: {score}</div>
            <div className={`badge text-sm ${timeLeft <= 10 ? 'bg-destructive/15 text-destructive' : ''}`}>⏱️ {timeLeft}s</div>
          </div>

          <div
            className="relative w-full rounded-2xl border border-border overflow-hidden bg-card"
            style={{ height: '400px' }}
          >
            <AnimatePresence>
              {thoughts.filter(t => !t.popped).map(t => (
                <motion.button
                  key={t.id}
                  className="absolute px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium cursor-pointer hover:bg-destructive/20 hover:border-destructive/40 transition-colors select-none"
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => popThought(t.id)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 1.5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.8 }}
                >
                  {t.text}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default ThoughtCloud;
