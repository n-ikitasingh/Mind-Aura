import React from 'react';
import { motion } from 'framer-motion';
import { useStore, type AccentColor, type AvatarStyle, ACCENT_MAP } from '@/store/useStore';
import AVATARS from '@/components/Avatars';

const ACCENT_OPTIONS: { color: AccentColor; label: string; hsl: string }[] = [
  { color: 'teal', label: 'Teal', hsl: `hsl(${ACCENT_MAP.teal.h}, ${ACCENT_MAP.teal.s}, ${ACCENT_MAP.teal.l})` },
  { color: 'lavender', label: 'Lavender', hsl: `hsl(${ACCENT_MAP.lavender.h}, ${ACCENT_MAP.lavender.s}, ${ACCENT_MAP.lavender.l})` },
  { color: 'amber', label: 'Amber', hsl: `hsl(${ACCENT_MAP.amber.h}, ${ACCENT_MAP.amber.s}, ${ACCENT_MAP.amber.l})` },
  { color: 'rose', label: 'Rose', hsl: `hsl(${ACCENT_MAP.rose.h}, ${ACCENT_MAP.rose.s}, ${ACCENT_MAP.rose.l})` },
  { color: 'mint', label: 'Mint', hsl: `hsl(${ACCENT_MAP.mint.h}, ${ACCENT_MAP.mint.s}, ${ACCENT_MAP.mint.l})` },
];

const BADGE_LIST = [
  { id: 'first-checkin', name: 'First Steps', icon: '🌱', description: 'Complete your first check-in' },
  { id: 'hydration-hero', name: 'Hydration Hero', icon: '💧', description: 'Log 8+ glasses of water' },
  { id: 'sleep-champion', name: 'Sleep Champion', icon: '😴', description: 'Log 8+ hours of sleep' },
  { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: '7-day streak' },
  { id: 'journal-5', name: 'Reflector', icon: '📝', description: 'Write 5 journal entries' },
  { id: 'sos-guardian', name: 'SOS Guardian', icon: '🆘', description: 'Use the SOS feature' },
];

const Profile: React.FC = () => {
  const { profile, updateProfile, xp, level, streak, badges, checkIns, journalEntries } = useStore();

  const xpForNextLevel = level * 500;
  const xpProgress = Math.min((xp % 500) / 500, 1);

  const exportData = () => {
    const data = { profile, checkIns, journalEntries, xp, level, streak, badges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindaura-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAllData = () => {
    if (confirm('Are you sure? This will delete all your data.')) {
      localStorage.removeItem('mindaura-storage');
      window.location.reload();
    }
  };

  const accentHsl = ACCENT_OPTIONS.find(a => a.color === profile.accentColor)?.hsl || '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile 👤</h1>

      {/* Avatar & Name */}
      <motion.div className="bg-card rounded-2xl p-6 border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold mb-4">Your Identity</h2>

        <div className="flex items-center gap-4 mb-6">
          {(() => { const A = AVATARS[profile.avatarStyle]; return A ? <A size={72} glow={accentHsl} /> : null; })()}
          <div>
            <input
              type="text"
              value={profile.name}
              onChange={e => updateProfile({ name: e.target.value })}
              className="input-field text-lg font-bold mb-2"
            />
            <select
              value={profile.role}
              onChange={e => updateProfile({ role: e.target.value as any })}
              className="input-field text-sm"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="professional">Professional</option>
            </select>
          </div>
        </div>

        {/* Avatar selection */}
        <p className="text-sm font-semibold mb-2">Choose Avatar</p>
        <div className="flex gap-3 flex-wrap mb-6">
          {([1, 2, 3, 4, 5, 6] as AvatarStyle[]).map(style => {
            const AvatarComp = AVATARS[style];
            return (
              <button
                key={style}
                onClick={() => updateProfile({ avatarStyle: style })}
                className={`rounded-full p-1 transition-all ${profile.avatarStyle === style ? 'ring-3 ring-accent scale-110' : 'hover:scale-105'}`}
              >
                {AvatarComp && <AvatarComp size={48} glow={profile.avatarStyle === style ? accentHsl : undefined} />}
              </button>
            );
          })}
        </div>

        {/* Accent color */}
        <p className="text-sm font-semibold mb-2">Accent Color</p>
        <div className="flex gap-3">
          {ACCENT_OPTIONS.map(opt => (
            <button
              key={opt.color}
              onClick={() => updateProfile({ accentColor: opt.color })}
              className={`w-10 h-10 rounded-full transition-all ${profile.accentColor === opt.color ? 'ring-3 ring-offset-2 ring-foreground/30 scale-110' : 'hover:scale-105'}`}
              style={{ background: opt.hsl }}
              title={opt.label}
            />
          ))}
        </div>
      </motion.div>

      {/* Personal Info */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-bold mb-4">Personal Info</h2>
        <p className="text-sm text-muted-foreground mb-3">Used for personalized water goals</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Weight (kg)</label>
            <input type="number" value={profile.weight || ''} onChange={e => updateProfile({ weight: Number(e.target.value) || undefined })} className="input-field" placeholder="65" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Age</label>
            <input type="number" value={profile.age || ''} onChange={e => updateProfile({ age: Number(e.target.value) || undefined })} className="input-field" placeholder="25" />
          </div>
        </div>
        {profile.weight && (
          <p className="text-sm text-muted-foreground mt-3">Your daily water goal: ~{Math.round(profile.weight * 35 / 250)} glasses ({Math.round(profile.weight * 35)} ml)</p>
        )}
      </div>

      {/* Gamification */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-bold mb-4">Stats & Gamification</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted rounded-xl">
            <p className="text-2xl font-black">{level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-xl">
            <p className="text-2xl font-black">{xp}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-xl">
            <p className="text-2xl font-black">🔥 {streak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">Level {level}</span>
            <span className="text-muted-foreground">{xp % 500}/{500} XP to next</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full accent-gradient" animate={{ width: `${xpProgress * 100}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>

        {/* Badges */}
        <p className="text-sm font-semibold mb-3">Badges</p>
        <div className="grid grid-cols-2 gap-3">
          {BADGE_LIST.map(b => {
            const earned = badges.find(eb => eb.id === b.id);
            return (
              <div key={b.id} className={`p-3 rounded-xl border transition-all ${earned ? 'border-accent bg-accent/5' : 'border-border opacity-50'}`}>
                <span className="text-2xl">{b.icon}</span>
                <p className="text-sm font-semibold mt-1">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-bold mb-4">Data Management</h2>
        <div className="flex gap-3">
          <button onClick={exportData} className="btn-secondary text-sm">📥 Export JSON</button>
          <button onClick={deleteAllData} className="px-4 py-2 rounded-xl text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all">🗑️ Delete All Data</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
