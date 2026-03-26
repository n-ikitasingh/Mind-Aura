import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, CartesianGrid } from 'recharts';

const Analytics: React.FC = () => {
  const { checkIns } = useStore();

  const trendData = useMemo(() => {
    const byDate: Record<string, number[]> = {};
    checkIns.forEach(c => {
      if (!byDate[c.date]) byDate[c.date] = [];
      byDate[c.date].push(c.wellnessScore);
    });
    return Object.entries(byDate)
      .map(([date, scores]) => ({
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }))
      .slice(-30);
  }, [checkIns]);

  const moodDist = useMemo(() => {
    const counts: Record<string, number> = { amazing: 0, good: 0, okay: 0, low: 0, awful: 0 };
    checkIns.forEach(c => counts[c.mood]++);
    return Object.entries(counts).map(([mood, count]) => ({ mood, count }));
  }, [checkIns]);

  const correlationData = useMemo(() => {
    return checkIns.filter(c => c.activities.find(a => a.type === 'sleep' && a.sleepHours)).map(c => ({
      sleep: c.activities.find(a => a.type === 'sleep')!.sleepHours!,
      score: c.wellnessScore,
    }));
  }, [checkIns]);

  // Sudden drop detection
  const suddenDrop = useMemo(() => {
    if (trendData.length < 2) return null;
    const last = trendData[trendData.length - 1].score;
    const prev = trendData[trendData.length - 2].score;
    if (prev - last > 15) return { drop: prev - last, from: prev, to: last };
    return null;
  }, [trendData]);

  // Pixel grid (last 365 days)
  const pixelData = useMemo(() => {
    const scoreByDate: Record<string, number> = {};
    checkIns.forEach(c => {
      if (!scoreByDate[c.date]) scoreByDate[c.date] = c.wellnessScore;
      else scoreByDate[c.date] = Math.round((scoreByDate[c.date] + c.wellnessScore) / 2);
    });
    const days: { date: string; score: number }[] = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      days.push({ date: d, score: scoreByDate[d] || 0 });
    }
    return days;
  }, [checkIns]);

  const getPixelColor = (score: number) => {
    if (score === 0) return 'bg-muted';
    if (score >= 75) return 'bg-teal';
    if (score >= 50) return 'bg-amber';
    if (score >= 25) return 'bg-lavender';
    return 'bg-rose';
  };

  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-h').trim();
  const chartColor = `hsl(${accentColor || 170}, 48%, 45%)`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Analytics 📊</h1>

      {checkIns.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-lg font-semibold mb-2">No data yet</p>
          <p className="text-sm text-muted-foreground">Start checking in to see your analytics!</p>
        </div>
      ) : (
        <>
          {/* Sudden drop alert */}
          {suddenDrop && (
            <motion.div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-sm font-bold text-destructive">⚠️ Sudden Drop Detected</p>
              <p className="text-sm text-muted-foreground">Your wellness dropped {suddenDrop.drop} points (from {suddenDrop.from} to {suddenDrop.to}). Consider checking in and talking to someone.</p>
            </motion.div>
          )}

          {/* Trend */}
          <motion.div className="bg-card rounded-2xl p-5 border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-bold mb-4">Wellness Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke={chartColor} strokeWidth={3} dot={{ fill: chartColor, r: 4 }} activeDot={{ r: 6, fill: chartColor }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mood dist */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="text-sm font-bold mb-4">Mood Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={moodDist}>
                  <XAxis dataKey="mood" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
                  <Bar dataKey="count" fill={chartColor} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep correlation */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="text-sm font-bold mb-4">Sleep vs Wellness</h3>
              {correlationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="sleep" name="Sleep (h)" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="score" name="Score" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
                    <Scatter data={correlationData} fill={chartColor} />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Log sleep data to see correlations</p>
              )}
            </div>
          </div>

          {/* Pixel grid */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="text-sm font-bold mb-4">Year Overview</h3>
            <div className="flex flex-wrap gap-[3px]">
              {pixelData.map(d => (
                <div
                  key={d.date}
                  className={`w-[10px] h-[10px] rounded-[2px] ${getPixelColor(d.score)} transition-colors`}
                  title={`${d.date}: ${d.score || 'No data'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-muted" /> No data</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-rose" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-lavender" /> Fair</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber" /> Good</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal" /> Great</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
