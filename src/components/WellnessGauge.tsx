import React from 'react';
import { motion } from 'framer-motion';

interface WellnessGaugeProps {
  score: number;
  size?: number;
}

const WellnessGauge: React.FC<WellnessGaugeProps> = ({ score, size = 120 }) => {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score >= 75) return 'hsl(var(--primary))';
    if (score >= 50) return 'hsl(var(--amber))';
    if (score >= 25) return 'hsl(var(--accent))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.65 }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <path
          d={`M 8 ${size * 0.6} A ${radius} ${radius} 0 0 1 ${size - 8} ${size * 0.6}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 8 ${size * 0.6} A ${radius} ${radius} 0 0 1 ${size - 8} ${size * 0.6}`}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <motion.span
          className="text-2xl font-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Wellness</p>
      </div>
    </div>
  );
};

export default WellnessGauge;
