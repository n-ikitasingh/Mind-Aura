import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, type Mood, type ActivityDetail, type CheckIn } from '@/store/useStore';
import { calculateWellnessScore, getInsight, QUOTES, DAILY_CHALLENGES } from '@/lib/wellness';
import WellnessGauge from '@/components/WellnessGauge';
import Modal from '@/components/Modal';

const MOODS: { mood: Mood; emoji: string; label: string }[] = [
  { mood: 'amazing', emoji: '🤩', label: 'Amazing' },
  { mood: 'good', emoji: '😊', label: 'Good' },
  { mood: 'okay', emoji: '😐', label: 'Okay' },
  { mood: 'low', emoji: '😔', label: 'Low' },
  { mood: 'awful', emoji: '😢', label: 'Awful' },
];

const ACTIVITY_TYPES = [
  { type: 'sleep' as const, emoji: '😴', label: 'Sleep' },
  { type: 'water' as const, emoji: '💧', label: 'Water' },
  { type: 'exercise' as const, emoji: '🏃', label: 'Exercise' },
  { type: 'social' as const, emoji: '👥', label: 'Social' },
  { type: 'meditation' as const, emoji: '🧘', label: 'Meditation' },
];

const Dashboard: React.FC = () => {
  const { checkIns, addCheckIn, addXP, profile, dailyChallenge, setDailyChallenge, completeChallenge, journalEntries, streak } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [activityDetails, setActivityDetails] = useState<ActivityDetail[]>([]);
  const [activityModal, setActivityModal] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quote, setQuote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  // Temp state for modals
  const [sleepHours, setSleepHours] = useState(7);
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [exerciseType, setExerciseType] = useState('Walking');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [socialWith, setSocialWith] = useState('Friend');
  const [socialRating, setSocialRating] = useState(3);
  const [meditationDuration, setMeditationDuration] = useState(10);

  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = checkIns.filter(c => c.date === today);
  const latestScore = todayCheckIns.length > 0 ? todayCheckIns[todayCheckIns.length - 1].wellnessScore : 0;

  // Daily challenge
  useEffect(() => {
    if (!dailyChallenge || dailyChallenge.date !== today) {
      const c = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
      setDailyChallenge({ id: crypto.randomUUID(), text: c.text, xp: c.xp, completed: false, date: today });
    }
  }, [today, dailyChallenge, setDailyChallenge]);

  const toggleActivity = (type: string) => {
    const next = new Set(selectedActivities);
    if (next.has(type)) {
      next.delete(type);
      setActivityDetails(prev => prev.filter(a => a.type !== type));
    } else {
      next.add(type);
      setActivityModal(type);
    }
    setSelectedActivities(next);
  };

  const saveActivityDetail = useCallback(() => {
    if (!activityModal) return;
    const detail: ActivityDetail = { type: activityModal as ActivityDetail['type'] };
    switch (activityModal) {
      case 'sleep': detail.sleepHours = sleepHours; break;
      case 'water': detail.waterGlasses = waterGlasses; break;
      case 'exercise': detail.exerciseType = exerciseType; detail.exerciseDuration = exerciseDuration; break;
      case 'social': detail.socialWith = socialWith; detail.socialRating = socialRating; break;
      case 'meditation': detail.meditationDuration = meditationDuration; break;
    }
    setActivityDetails(prev => [...prev.filter(a => a.type !== activityModal), detail]);
    setActivityModal(null);
  }, [activityModal, sleepHours, waterGlasses, exerciseType, exerciseDuration, socialWith, socialRating, meditationDuration]);

  const submitCheckIn = () => {
    if (!selectedMood) return;
    const score = calculateWellnessScore(selectedMood, activityDetails);
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      date: today,
      mood: selectedMood,
      activities: activityDetails,
      wellnessScore: score,
      timestamp: Date.now(),
    };
    addCheckIn(checkIn);
    addXP(10 + activityDetails.length * 5);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    setSelectedMood(null);
    setSelectedActivities(new Set());
    setActivityDetails([]);
  };

  const insight = getInsight(checkIns);
  const recentJournal = journalEntries.length > 0 ? journalEntries[journalEntries.length - 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  background: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--amber))', 'hsl(var(--rose))', 'hsl(var(--mint))'][i % 5],
                }}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{
                  y: -(Math.random() * 400 + 200),
                  x: (Math.random() - 0.5) * 200,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hey, {profile.name}! 👋</h1>
          <p className="text-muted-foreground text-sm">How are you feeling today?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-bold">🔥 {streak}</p>
          </div>
          <WellnessGauge score={latestScore} size={100} />
        </div>
      </div>

      {/* Quick Check-in */}
      <motion.div
        className="bg-card rounded-2xl p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-bold mb-4">Quick Check-in</h2>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">How's your mood?</p>
          <div className="flex gap-3 flex-wrap">
            {MOODS.map(m => (
              <button
                key={m.mood}
                onClick={() => setSelectedMood(m.mood)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
                  selectedMood === m.mood ? 'bg-accent/15 ring-2 ring-accent scale-105' : 'hover:bg-muted'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Activities</p>
          <div className="flex gap-2 flex-wrap">
            {ACTIVITY_TYPES.map(a => (
              <button
                key={a.type}
                onClick={() => toggleActivity(a.type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedActivities.has(a.type) ? 'bg-accent/15 ring-2 ring-accent' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span>{a.emoji}</span>
                {a.label}
                {activityDetails.find(d => d.type === a.type) && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={submitCheckIn} disabled={!selectedMood} className="btn-primary w-full disabled:opacity-40 disabled:pointer-events-none">
          Log Check-in ✨
        </button>
      </motion.div>

      {/* Activity Detail Modals */}
      <Modal open={activityModal === 'sleep'} onClose={() => { setActivityModal(null); selectedActivities.delete('sleep'); setSelectedActivities(new Set(selectedActivities)); }} title="😴 Sleep Details">
        <label className="block text-sm font-medium mb-2">Hours slept: {sleepHours}</label>
        <input type="range" min={1} max={14} step={0.5} value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} className="w-full accent-current" style={{ accentColor: 'hsl(var(--accent))' }} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1h</span><span>14h</span></div>
        <button onClick={saveActivityDetail} className="btn-primary w-full mt-4">Save</button>
      </Modal>

      <Modal open={activityModal === 'water'} onClose={() => { setActivityModal(null); selectedActivities.delete('water'); setSelectedActivities(new Set(selectedActivities)); }} title="💧 Water Intake">
        <label className="block text-sm font-medium mb-2">Glasses: {waterGlasses}</label>
        <input type="range" min={1} max={15} value={waterGlasses} onChange={e => setWaterGlasses(Number(e.target.value))} className="w-full" style={{ accentColor: 'hsl(var(--accent))' }} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>15</span></div>
        <button onClick={saveActivityDetail} className="btn-primary w-full mt-4">Save</button>
      </Modal>

      <Modal open={activityModal === 'exercise'} onClose={() => { setActivityModal(null); selectedActivities.delete('exercise'); setSelectedActivities(new Set(selectedActivities)); }} title="🏃 Exercise Details">
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="flex gap-2 flex-wrap mb-4">
          {['Walking', 'Running', 'Yoga', 'Other'].map(t => (
            <button key={t} onClick={() => setExerciseType(t)} className={`px-3 py-1.5 rounded-lg text-sm ${exerciseType === t ? 'bg-accent/15 ring-2 ring-accent font-semibold' : 'bg-muted'}`}>{t}</button>
          ))}
        </div>
        <label className="block text-sm font-medium mb-2">Duration: {exerciseDuration} min</label>
        <input type="range" min={5} max={120} step={5} value={exerciseDuration} onChange={e => setExerciseDuration(Number(e.target.value))} className="w-full" style={{ accentColor: 'hsl(var(--accent))' }} />
        <button onClick={saveActivityDetail} className="btn-primary w-full mt-4">Save</button>
      </Modal>

      <Modal open={activityModal === 'social'} onClose={() => { setActivityModal(null); selectedActivities.delete('social'); setSelectedActivities(new Set(selectedActivities)); }} title="👥 Social Connection">
        <label className="block text-sm font-medium mb-2">Who did you connect with?</label>
        <div className="flex gap-2 flex-wrap mb-4">
          {['Friend', 'Family', 'Colleague', 'Other'].map(t => (
            <button key={t} onClick={() => setSocialWith(t)} className={`px-3 py-1.5 rounded-lg text-sm ${socialWith === t ? 'bg-accent/15 ring-2 ring-accent font-semibold' : 'bg-muted'}`}>{t}</button>
          ))}
        </div>
        <label className="block text-sm font-medium mb-2">How did it feel? {socialRating}/5</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(r => (
            <button key={r} onClick={() => setSocialRating(r)} className={`w-10 h-10 rounded-full text-sm font-bold ${socialRating >= r ? 'accent-gradient text-white' : 'bg-muted'}`}>{r}</button>
          ))}
        </div>
        <button onClick={saveActivityDetail} className="btn-primary w-full mt-4">Save</button>
      </Modal>

      <Modal open={activityModal === 'meditation'} onClose={() => { setActivityModal(null); selectedActivities.delete('meditation'); setSelectedActivities(new Set(selectedActivities)); }} title="🧘 Meditation">
        <label className="block text-sm font-medium mb-2">Duration: {meditationDuration} min</label>
        <input type="range" min={1} max={60} value={meditationDuration} onChange={e => setMeditationDuration(Number(e.target.value))} className="w-full" style={{ accentColor: 'hsl(var(--accent))' }} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 min</span><span>60 min</span></div>
        <button onClick={saveActivityDetail} className="btn-primary w-full mt-4">Save</button>
      </Modal>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Insight */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border card-hover" whileHover={{ y: -2 }}>
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2">🧠 MindAura Insight</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
        </motion.div>

        {/* Quote */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border card-hover cursor-pointer" whileHover={{ y: -2 }} onClick={() => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])}>
          <h3 className="text-sm font-bold mb-2">💭 Daily Quote</h3>
          <p className="text-sm text-muted-foreground italic leading-relaxed">"{quote}"</p>
          <p className="text-xs text-muted-foreground mt-2">Tap for new quote</p>
        </motion.div>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <motion.div className="bg-card rounded-2xl p-5 border border-border card-hover" whileHover={{ y: -2 }}>
            <h3 className="text-sm font-bold mb-2">🎯 Daily Challenge</h3>
            <p className="text-sm mb-3">{dailyChallenge.text}</p>
            {dailyChallenge.completed ? (
              <div className="badge">✅ Completed! +{dailyChallenge.xp} XP</div>
            ) : (
              <button onClick={completeChallenge} className="btn-primary text-xs px-4 py-2">Mark Complete (+{dailyChallenge.xp} XP)</button>
            )}
          </motion.div>
        )}

        {/* Recent Journal */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border card-hover" whileHover={{ y: -2 }}>
          <h3 className="text-sm font-bold mb-2">📓 Recent Journal</h3>
          {recentJournal ? (
            <p className="text-sm text-muted-foreground line-clamp-3">{recentJournal.content}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No entries yet. Start journaling!</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
