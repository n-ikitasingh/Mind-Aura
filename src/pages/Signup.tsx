import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import FloatingParticles from '@/components/FloatingParticles';

const Signup: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div className="text-center max-w-md mx-4 bg-card rounded-2xl p-8 border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <p className="text-4xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold mb-2">Check your email!</h2>
          <p className="text-muted-foreground mb-6">We sent a confirmation link. Click it to activate your account.</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <FloatingParticles count={20} />
      <motion.div
        className="relative z-10 w-full max-w-md mx-4 bg-card rounded-2xl p-8 border border-border"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center text-white font-black text-lg mx-auto mb-3">M</div>
          <h1 className="text-2xl font-bold">Join MindAura</h1>
          <p className="text-sm text-muted-foreground">Start your wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Your name" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required minLength={6} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">I am a...</label>
            <div className="flex gap-2">
              {['student', 'faculty', 'professional'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${role === r ? 'bg-accent/15 ring-2 ring-accent' : 'bg-muted'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Creating account...' : 'Sign Up 🚀'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="font-semibold hover:underline" style={{ color: 'hsl(var(--accent))' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
