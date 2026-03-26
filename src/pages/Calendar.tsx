import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

const MOOD_EMOJI: Record<string, string> = { amazing: '🤩', good: '😊', okay: '😐', low: '😔', awful: '😢' };

const Calendar: React.FC = () => {
  const { checkIns, journalEntries } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const checkInsByDate = useMemo(() => {
    const map: Record<string, typeof checkIns> = {};
    checkIns.forEach(c => {
      if (!map[c.date]) map[c.date] = [];
      map[c.date].push(c);
    });
    return map;
  }, [checkIns]);

  const journalByDate = useMemo(() => {
    const map: Record<string, typeof journalEntries> = {};
    journalEntries.forEach(j => {
      if (!map[j.date]) map[j.date] = [];
      map[j.date].push(j);
    });
    return map;
  }, [journalEntries]);

  const getDayColor = (dateStr: string) => {
    const dayCheckIns = checkInsByDate[dateStr];
    if (!dayCheckIns?.length) return '';
    const avg = dayCheckIns.reduce((a, c) => a + c.wellnessScore, 0) / dayCheckIns.length;
    if (avg >= 75) return 'bg-teal/20 text-teal';
    if (avg >= 50) return 'bg-amber/20 text-amber';
    if (avg >= 25) return 'bg-lavender/20 text-lavender';
    return 'bg-rose/20 text-rose';
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date().toISOString().split('T')[0];

  const selectedCheckIns = selectedDay ? checkInsByDate[selectedDay] || [] : [];
  const selectedJournals = selectedDay ? journalByDate[selectedDay] || [] : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Calendar 📅</h1>

      <motion.div className="bg-card rounded-2xl p-6 border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="btn-ghost">← Prev</button>
          <h2 className="text-lg font-bold">
            {currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="btn-ghost">Next →</button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDay;
            const colorClass = getDayColor(dateStr);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(dateStr === selectedDay ? null : dateStr)}
                className={`aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all ${
                  isSelected ? 'ring-2 ring-accent scale-105' : ''
                } ${isToday ? 'font-bold' : ''} ${colorClass || 'hover:bg-muted'}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Day detail */}
      {selectedDay && (
        <motion.div className="bg-card rounded-2xl p-6 border border-border" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-bold mb-4">{new Date(selectedDay + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>

          {selectedCheckIns.length === 0 && selectedJournals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data for this day.</p>
          ) : (
            <div className="space-y-4">
              {selectedCheckIns.map(c => (
                <div key={c.id} className="p-3 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{MOOD_EMOJI[c.mood]}</span>
                    <span className="font-semibold capitalize">{c.mood}</span>
                    <span className="badge ml-auto">Score: {c.wellnessScore}</span>
                  </div>
                  {c.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {c.activities.map((a, i) => (
                        <span key={i} className="text-xs bg-card px-2 py-1 rounded-lg">
                          {a.type === 'sleep' && `😴 ${a.sleepHours}h`}
                          {a.type === 'water' && `💧 ${a.waterGlasses} glasses`}
                          {a.type === 'exercise' && `🏃 ${a.exerciseType} ${a.exerciseDuration}min`}
                          {a.type === 'social' && `👥 ${a.socialWith} (${a.socialRating}/5)`}
                          {a.type === 'meditation' && `🧘 ${a.meditationDuration}min`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {selectedJournals.map(j => (
                <div key={j.id} className="p-3 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">📝 Journal</p>
                  <p className="text-sm line-clamp-3">{j.content}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Calendar;
