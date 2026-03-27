import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore, type ChatMessage } from '@/store/useStore';

// Helper to get latest activity
function getLatestActivity(activities: any[], type: string) {
  return activities?.find(a => a.type === type);
}

// Enhanced response generator (now uses computed wellness and mood)
function generateAIResponse(
  userMsg: string,
  checkIns: any[],
  journalEntries: any[],
  profile: any,
  wellnessScore: number,
  todayMood: string
): string {
  const lower = userMsg.toLowerCase().trim();
  const lastCheckIn = checkIns[checkIns.length - 1];
  const userName = profile?.name || 'friend';
  const mood = todayMood || lastCheckIn?.mood || 'neutral';
  const wellness = wellnessScore ?? lastCheckIn?.wellnessScore ?? 70;

  // ---------- Priority topics ----------
  // 1. Suicidal thoughts / crisis
  if (lower.includes('suicide') || lower.includes('kill myself') || lower.includes('end my life') || lower.includes('suicidal') ||lower.includes('difficult') ||
      lower.includes('want to die') || lower.includes('no reason to live') || lower.includes('can\'t go on')) {
    return `I'm really glad you reached out. You are not alone, and there is help available. Please consider using the SOS feature in MindAura for immediate support, or reach out to a crisis helpline. If you're in immediate danger, please contact emergency services. You matter. 💙`;
  }

  // 2. Who are you?
  if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('who r u') || lower.includes('what r u')) {
    return `I'm Aura, your MindAura companion! I'm here to listen, support you, and help you navigate your mental wellness journey. I can talk about your mood, sleep, water intake, stress, and more. How can I help you today? 🌟`;
  }

  // 3. Who am I?
  if (lower.includes('who am i') || lower.includes('tell me about me') || lower.includes('who m i') || lower.includes('who is') && lower.includes(userName.toLowerCase())) {
    const role = profile?.role || 'someone on a wellness journey';
    return `You're ${userName}, a ${role}. Today you're feeling ${mood}, and your wellness score is ${wellness}. You've been using MindAura to track your mental health – that's a powerful step. 🌱`;
  }

  // 4. Nonsense / random text (detect very short or non‑topic messages)
  const isNonsense = (lower.length < 3 && !lower.match(/^(hi|hey|hello|ok|yes|no)$/)) ||
                      (lower.includes('asdf') || lower.includes('qwerty') || lower.includes('test') || lower.includes('lorem'));
  if (isNonsense) {
    const gentleResponses = [
      `Hmm, I'm not sure what you mean. Want to talk about how you're feeling, your sleep, or maybe some stress relief? 😊`,
      `I'm here to help with your mental wellness. Would you like to share how you're doing today?`,
      `I didn't quite catch that. You can ask me about your mood, sleep, water intake, or just tell me how you're feeling. 💬`,
    ];
    return gentleResponses[Math.floor(Math.random() * gentleResponses.length)];
  }

  // Sleep
  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('rest')) {
    const sleepAct = getLatestActivity(lastCheckIn?.activities, 'sleep');
    if (sleepAct?.sleepHours) {
      const hours = sleepAct.sleepHours;
      if (hours < 6) return `I see you slept only ${hours} hours recently. Lack of sleep can really affect your mood. Try to wind down earlier tonight – maybe a warm drink and no screens? 😴`;
      if (hours >= 6 && hours < 8) return `You got ${hours} hours of sleep – good, but could be better. Aim for 7-9 hours for optimal mental clarity. What time did you go to bed?`;
      return `Great job getting ${hours} hours of sleep! Quality rest is so important. 😊`;
    }
    return "Sleep is key for mental wellness. How many hours did you sleep last night? I can help you build a bedtime routine if you'd like. 🌙";
  }

  // Water / hydration
  if (lower.includes('water') || lower.includes('hydrat') || lower.includes('drink')) {
    const waterAct = getLatestActivity(lastCheckIn?.activities, 'water');
    if (waterAct?.waterGlasses) {
      const glasses = waterAct.waterGlasses;
      const goal = 8;
      if (glasses < goal) return `You've had ${glasses} glasses of water. Try to drink ${goal - glasses} more to stay hydrated! 💧`;
      return `Awesome – you've had ${glasses} glasses! Staying hydrated helps your mood and energy. 🚰`;
    }
    return "Hydration is important. How many glasses of water have you had today? I can help you set a goal. 💧";
  }

  // Stress / anxiety
  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('anxiety') || lower.includes('overwhelm')) {
    return `I hear you, ${userName}. Stress is tough. Would you like to try a quick breathing exercise? Inhale for 4 seconds, hold for 7, exhale for 8. We can do it together. 🌬️ Or you can tap the SOS button for a guided session. You've got this.`;
  }

  // Sadness / depression
  if (lower.includes('sad') || lower.includes('down') || lower.includes('depressed') || lower.includes('unhappy')) {
    return `I'm sorry you're feeling this way, ${userName}. It's okay to not be okay. Writing in your journal might help – it's a safe space to let your feelings out. 💙 Would you like me to suggest a journal prompt?`;
  }

  // Happy / good
  if (lower.includes('happy') || lower.includes('great') || lower.includes('good') || lower.includes('awesome')) {
    return `That's wonderful to hear, ${userName}! 🎉 What made you feel this way? Recognizing positive moments helps you cultivate more of them.`;
  }

  // Gratitude
  if (lower.includes('grateful') || lower.includes('thank') || lower.includes('appreciate')) {
    return `Gratitude is a powerful practice! Would you like to share one thing you're grateful for today? 🌟 It could be small – like a nice cup of tea or a sunny moment.`;
  }

  // Loneliness
  if (lower.includes('lonely') || lower.includes('alone')) {
    return `Feeling lonely is hard, ${userName}. Connecting with someone, even a short message, can help. Is there a friend or family member you could reach out to? You're not alone – I'm here too. 💙`;
  }

  // Anger / frustration
  if (lower.includes('angry') || lower.includes('frustrated') || lower.includes('annoyed')) {
    return `It's okay to feel angry. Sometimes stepping away and taking a few deep breaths can help. Want to try a quick breathing exercise with me? Or you can write down what's bothering you in your journal. 🧘`;
  }

  // Motivation / energy
  if (lower.includes('motivation') || lower.includes('energy') || lower.includes('lazy') || lower.includes('procrastinate')) {
    return `Feeling low on motivation? Start with one small thing – even a 5-minute walk or stretching. I'm here to cheer you on! What's one tiny step you can take right now? 🏃`;
  }

  // Focus / concentration
  if (lower.includes('focus') || lower.includes('concentrate') || lower.includes('distracted')) {
    return `Struggling to focus? Try the Pomodoro technique: work for 25 minutes, then take a 5-minute break. Would you like me to remind you? ⏱️`;
  }

  // Breathing / relax
  if (lower.includes('breathe') || lower.includes('relax') || lower.includes('calm')) {
    return `Let's take a calming breath together. Inhale slowly... hold... exhale. Feel a little lighter? You can always use the SOS feature for a full breathing exercise. 🌿`;
  }

  // Exercise
  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('run') || lower.includes('walk')) {
    const exerciseAct = getLatestActivity(lastCheckIn?.activities, 'exercise');
    if (exerciseAct?.minutes) {
      return `You exercised for ${exerciseAct.minutes} minutes recently – that's great for your mood! What type of exercise do you enjoy most? 🏋️`;
    }
    return "Exercise is a natural mood booster. Even a 10-minute walk can help. Have you moved your body today? 🚶";
  }

  // Social connection
  if (lower.includes('social') || lower.includes('friend') || lower.includes('family') || lower.includes('talk')) {
    const socialAct = getLatestActivity(lastCheckIn?.activities, 'social');
    if (socialAct?.with) {
      return `You connected with ${socialAct.with} – that's wonderful! How did it feel? Human connection is so important. 🤝`;
    }
    return "Connecting with others can lift your spirits. Is there someone you'd like to reach out to today? 📞";
  }

  // Journal prompt
  if (lower.includes('journal') || lower.includes('prompt') || lower.includes('write')) {
    const prompts = [
      "What was the best part of your day?",
      "What emotion are you feeling most right now?",
      "What's one thing you're proud of today?",
      "If you could give advice to your future self, what would you say?",
    ];
    return `Here's a journal prompt for you: "${prompts[Math.floor(Math.random() * prompts.length)]}" ✍️ You can write it in your journal page.`;
  }

  // SOS / emergency
  if (lower.includes('sos') || lower.includes('emergency') || lower.includes('help me') || lower.includes('crisis')) {
    return `I'm here for you. If you're in crisis, please reach out to a trusted person or use our SOS feature for instant support. You can also call a crisis helpline. You matter. 💙`;
  }

  // Self-care / habits
  if (lower.includes('self-care') || lower.includes('habit') || lower.includes('routine')) {
    return "Self-care is about doing what replenishes you. A small habit like a morning stretch, a few minutes of reading, or a warm bath can make a difference. What's one self-care act you'd like to try today? 🛁";
  }

  // Understanding the user (who am I?)
  if (lower.includes('who am i') || lower.includes('tell me about me')) {
    const role = profile?.role || 'someone on a wellness journey';
    return `You're ${userName}, a ${role}. Today you're feeling ${mood}, and your wellness score is ${wellness}. You've been using MindAura to track your mental health – that's a powerful step. 🌱`;
  }

  // General greeting
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return `Hi ${userName}! How are you feeling today? I'm here to support you. 💬`;
  }

  // Default: use a variety of engaging fallbacks
  const fallbacks = [
    `That's interesting, ${userName}. Tell me more about how you're feeling. 🤔`,
    `I appreciate you sharing. Remember, every small step counts on your wellness journey! 🌱`,
    `How has your day been overall? Any highlights or challenges? ✨`,
    `Your current wellness score is ${wellness}. Let's keep nurturing that. Would you like a suggestion? 💡`,
    "Would you like to try a quick breathing exercise? It only takes a minute and can really help center your thoughts. 🧘",
    "What's one small thing that could make your day a little better right now?",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// Dynamic suggestion chips based on user data
function getDynamicSuggestions(checkIns: any[], wellnessScore: number): string[] {
  const base = [
    "How am I sleeping?",
    "I feel stressed",
    "Tips for better mood",
    "Am I drinking enough water?",
    "What can you do?",
  ];
  const lastCheckIn = checkIns[checkIns.length - 1];
  if (lastCheckIn?.wellnessScore && lastCheckIn.wellnessScore < 50) {
    base.push("I need help");
    base.push("Can we do a breathing exercise?");
  }
  if (lastCheckIn?.activities?.length === 0) {
    base.push("Log my activities");
  }
  return base.slice(0, 5);
}

const Chat: React.FC = () => {
  // Destructure only what exists in the store
  const { chatMessages, addChatMessage, checkIns, journalEntries, profile } = useStore();

  // Compute wellnessScore and todayMood from checkIns and profile
  const lastCheckIn = checkIns[checkIns.length - 1];
  const wellnessScore = lastCheckIn?.wellnessScore ?? 70; // default 70
  const todayMood = lastCheckIn?.mood ?? 'neutral';

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text, checkIns, journalEntries, profile, wellnessScore, todayMood);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
      };
      addChatMessage(aiMsg);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const suggestions = getDynamicSuggestions(checkIns, wellnessScore);

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">Chat 💬</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-lg font-semibold mb-2">Welcome to MindAura Chat</p>
            <p className="text-sm text-muted-foreground mb-6">
              I'm here to listen and help with your wellness journey.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-accent/15 text-sm font-medium transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map(msg => (
          <motion.div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'accent-gradient text-white rounded-br-md'
                  : 'bg-muted rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {chatMessages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 rounded-full bg-muted hover:bg-accent/15 text-xs font-medium whitespace-nowrap transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Type a message..."
          className="input-field flex-1"
        />
        <button onClick={() => sendMessage(input)} className="btn-primary px-6">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;