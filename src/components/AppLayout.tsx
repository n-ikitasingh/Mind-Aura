import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { useDataSync } from '@/hooks/useDataSync';
import AVATARS from '@/components/Avatars';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/calendar', label: 'Calendar', icon: '📅' },
  { path: '/journal', label: 'Journal', icon: '📝' },
  { path: '/chat', label: 'Chat', icon: '💬' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/thought-cloud', label: 'Thought Cloud', icon: '☁️' },
  { path: '/sos', label: 'SOS', icon: '🆘' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, darkMode, toggleDarkMode, xp, level, streak } = useStore();
  const { user, signOut } = useAuth();
  useDataSync();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const AvatarComp = AVATARS[profile.avatarStyle];

  const xpForNextLevel = level * 500;
  const xpProgress = Math.min((xp % 500) / 500, 1);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-border">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center text-sm font-black text-white">M</div>
            <span className="text-lg font-extrabold gradient-text">MindAura</span>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            {AvatarComp && <AvatarComp size={36} />}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Lvl {level}</span>
              <span className="text-muted-foreground">{xp}/{xpForNextLevel} XP</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full accent-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          {user ? (
            <button onClick={async () => { await signOut(); navigate('/'); }} className="btn-ghost w-full text-sm mt-2 text-muted-foreground">
              Sign Out
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary w-full text-sm mt-2">
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden btn-ghost p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="text-xl">☰</span>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className="btn-ghost w-9 h-9 flex items-center justify-center rounded-full text-lg"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
