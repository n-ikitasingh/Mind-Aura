export function calculateWellnessScore(
  mood: string,
  activities: { type: string; sleepHours?: number; waterGlasses?: number; exerciseDuration?: number; socialRating?: number; meditationDuration?: number }[]
): number {
  const moodScores: Record<string, number> = {
    amazing: 95, good: 78, okay: 55, low: 30, awful: 10,
  };
  let score = moodScores[mood] || 50;

  for (const a of activities) {
    switch (a.type) {
      case 'sleep':
        if (a.sleepHours) {
          if (a.sleepHours >= 7 && a.sleepHours <= 9) score += 10;
          else if (a.sleepHours >= 6) score += 5;
          else score -= 5;
        } else score += 3;
        break;
      case 'water':
        if (a.waterGlasses) {
          score += Math.min(a.waterGlasses, 8);
        } else score += 3;
        break;
      case 'exercise':
        if (a.exerciseDuration) {
          score += Math.min(a.exerciseDuration / 3, 10);
        } else score += 5;
        break;
      case 'social':
        if (a.socialRating) {
          score += a.socialRating * 2;
        } else score += 5;
        break;
      case 'meditation':
        if (a.meditationDuration) {
          score += Math.min(a.meditationDuration / 2, 8);
        } else score += 5;
        break;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getInsight(
  checkIns: { mood: string; activities: { type: string; sleepHours?: number; waterGlasses?: number; exerciseDuration?: number }[]; date: string }[]
): string {
  if (checkIns.length === 0) return "Start your first check-in to get personalized insights! 🌟";

  const latest = checkIns[checkIns.length - 1];
  const insights: string[] = [];

  const sleep = latest.activities.find(a => a.type === 'sleep');
  if (sleep?.sleepHours) {
    const avgSleep = checkIns
      .map(c => c.activities.find(a => a.type === 'sleep')?.sleepHours)
      .filter(Boolean) as number[];
    const avg = avgSleep.length > 1 ? avgSleep.slice(0, -1).reduce((a, b) => a + b, 0) / (avgSleep.length - 1) : sleep.sleepHours;
    if (sleep.sleepHours > avg) {
      insights.push(`You slept ${sleep.sleepHours}h last night – that's ${(sleep.sleepHours - avg).toFixed(1)}h more than your average! 🎉`);
    } else if (sleep.sleepHours < 6) {
      insights.push(`Only ${sleep.sleepHours}h of sleep? Try winding down 30 min earlier tonight. 😴`);
    }
  }

  const water = latest.activities.find(a => a.type === 'water');
  if (water?.waterGlasses) {
    const pct = Math.round((water.waterGlasses / 8) * 100);
    insights.push(`You drank ${water.waterGlasses} glasses of water – ${pct}% of your daily goal! 💧`);
  }

  const exerciseDays = checkIns.filter(c => c.activities.some(a => a.type === 'exercise'));
  const lastExercise = exerciseDays[exerciseDays.length - 1];
  if (!lastExercise || lastExercise.date !== latest.date) {
    const daysSince = lastExercise
      ? Math.round((Date.now() - new Date(lastExercise.date).getTime()) / 86400000)
      : null;
    if (daysSince && daysSince > 2) {
      insights.push(`You haven't exercised in ${daysSince} days. A 10-min walk can boost your mood! 🚶`);
    }
  }

  if (insights.length === 0) {
    const moodEmojis: Record<string, string> = { amazing: '🌟', good: '😊', okay: '😐', low: '😔', awful: '😢' };
    insights.push(`Your mood is ${latest.mood} ${moodEmojis[latest.mood] || ''}. Keep tracking to unlock deeper insights!`);
  }

  return insights[Math.floor(Math.random() * insights.length)];
}

export const QUOTES = [
  "The greatest glory in living lies not in never falling, but in rising every time we fall. – Nelson Mandela",
  "Your mind is a garden, your thoughts are the seeds. You can grow flowers or you can grow weeds. – William Wordsworth",
  "Almost everything will work again if you unplug it for a few minutes, including you. – Anne Lamott",
  "You don't have to control your thoughts. You just have to stop letting them control you. – Dan Millman",
  "Self-care is not self-indulgence, it is self-preservation. – Audre Lorde",
  "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure. – Oprah Winfrey",
  "It's not the load that breaks you down, it's the way you carry it. – Lou Holtz",
  "Happiness is not something ready-made. It comes from your own actions. – Dalai Lama",
  "You are not your illness. You have a name, a history, a personality. Staying yourself is part of the battle. – Julian Seifter",
  "The only way out is through. – Robert Frost",
];

export const DAILY_CHALLENGES = [
  { text: "Drink a glass of water right now 💧", xp: 15 },
  { text: "Take 3 deep breaths 🌬️", xp: 15 },
  { text: "Text a friend something nice 💬", xp: 15 },
  { text: "Stand up and stretch for 1 minute 🧘", xp: 15 },
  { text: "Write down 3 things you're grateful for 📝", xp: 15 },
  { text: "Take a 5-minute walk outside 🌿", xp: 15 },
  { text: "Listen to your favorite song 🎵", xp: 15 },
  { text: "Close your eyes for 30 seconds and just be 🧘‍♀️", xp: 15 },
  { text: "Give someone a genuine compliment 🌸", xp: 15 },
  { text: "Put your phone down for 10 minutes 📱", xp: 15 },
];

export const JOURNAL_PROMPTS = [
  "What's one small thing that went well today?",
  "How are you really feeling right now? No filter.",
  "What would make tomorrow even 1% better?",
  "Who made you smile today?",
  "What's something you're looking forward to?",
  "If your mood were weather, what would it be?",
  "What's a worry you can let go of right now?",
  "Describe your perfect evening in 3 sentences.",
  "What's one kind thing you did for yourself today?",
  "What sound makes you feel calm?",
];

export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positive = ['happy', 'great', 'amazing', 'wonderful', 'love', 'grateful', 'excited', 'joy', 'smile', 'good', 'better', 'awesome', 'fantastic', 'beautiful', 'calm', 'peace', 'hope', 'proud'];
  const negative = ['sad', 'angry', 'anxious', 'worried', 'stressed', 'tired', 'awful', 'terrible', 'hate', 'fear', 'lonely', 'depressed', 'hurt', 'pain', 'cry', 'fail', 'bad', 'worse'];

  const lower = text.toLowerCase();
  let score = 0;
  positive.forEach(w => { if (lower.includes(w)) score++; });
  negative.forEach(w => { if (lower.includes(w)) score--; });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
