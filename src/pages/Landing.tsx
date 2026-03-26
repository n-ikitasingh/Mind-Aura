import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingParticles from '@/components/FloatingParticles';

const FEATURES = [
  { icon: '🧠', title: 'AI Insights', desc: 'Smart analysis of your wellness patterns' },
  { icon: '📊', title: 'Track Everything', desc: 'Mood, sleep, water, exercise & more' },
  { icon: '🎮', title: 'Gamified', desc: 'Earn XP, badges, and level up' },
  { icon: '🆘', title: 'SOS Support', desc: 'Breathing exercises when you need them' },
  { icon: '📓', title: 'Journaling', desc: 'Reflect with smart prompts' },
  { icon: '🔒', title: 'Private', desc: 'All data stays on your device' },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <FloatingParticles count={40} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-xl font-extrabold gradient-text">MindAura</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="btn-ghost text-sm">Log in</button>
          <button onClick={() => navigate('/signup')} className="btn-primary text-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge mb-6 mx-auto">✨ Your mental wellness companion</div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Your mind deserves{' '}
            <span className="gradient-text">better care</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your mood, build healthy habits, and unlock personalized insights — all while earning XP and leveling up your wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-base px-8 py-4">
              🚀 Try Demo Free
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary text-base px-8 py-4">
              Learn More →
            </button>
          </div>
        </motion.div>

        {/* Floating orb */}
        <motion.div
          className="absolute -right-20 top-10 w-64 h-64 rounded-full opacity-20 blur-3xl accent-gradient"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -left-20 bottom-10 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{ background: 'hsl(var(--secondary))' }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              className="bg-card rounded-2xl p-6 card-hover border border-border"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 MindAura. Built with 💚 for your wellbeing.</p>
      </footer>
    </div>
  );
};

export default Landing;
