import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore, type ChatMessage } from '@/store/useStore';

function generateAIResponse(userMsg: string, checkIns: any[], journalEntries: any[]): string {
  const lower = userMsg.toLowerCase();
  const lastCheckIn = checkIns[checkIns.length - 1];

  if (lower.includes('sleep')) {
    const sleep = lastCheckIn?.activities?.find((a: any) => a.type === 'sleep');
    if (sleep?.sleepHours) return `I see you slept ${sleep.sleepHours} hours recently. ${sleep.sleepHours < 7 ? 'Try to aim for 7-8 hours – it makes a huge difference!' : 'Great job keeping your sleep on track!'} 😴`;
    return "Sleep is crucial for mental wellness. Try to maintain a consistent bedtime routine. How many hours did you sleep last night?";
  }
  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('anxiety')) {
    return "I hear you. Stress is tough. Here's something that might help: try the 4-7-8 breathing technique. Inhale for 4 seconds, hold for 7, exhale for 8. You can also try our SOS breathing exercise! 🌬️";
  }
  if (lower.includes('sad') || lower.includes('down') || lower.includes('depressed')) {
    return "I'm sorry you're feeling this way. Remember, it's okay to not be okay. Have you tried writing in your journal? Sometimes putting feelings into words can help. Also, connecting with someone you trust can make a difference. 💙";
  }
  if (lower.includes('happy') || lower.includes('great') || lower.includes('good')) {
    return "That's wonderful to hear! 🎉 What do you think contributed to feeling this way? Recognizing the positive patterns helps you recreate them.";
  }
  if (lower.includes('water') || lower.includes('hydrat')) {
    const water = lastCheckIn?.activities?.find((a: any) => a.type === 'water');
    if (water?.waterGlasses) return `You've had ${water.waterGlasses} glasses today. ${water.waterGlasses < 8 ? `Try to drink ${8 - water.waterGlasses} more!` : 'Amazing hydration!'} 💧`;
    return "Staying hydrated is key for both physical and mental health. Aim for 8 glasses a day! 💧";
  }
  if (lower.includes('exercise') || lower.includes('workout')) {
    return "Exercise is one of the best mood boosters! Even a 10-minute walk can help. What type of exercise do you enjoy? 🏃";
  }
  if (lower.includes('help') || lower.includes('what can you do')) {
    return "I'm your MindAura companion! I can help you reflect on your mood, suggest wellness tips, discuss your sleep and water intake patterns, and more. Just chat with me about how you're feeling! 🌟";
  }

  const responses = [
    "That's interesting! Tell me more about how you're feeling. 🤔",
    "I appreciate you sharing. Remember, every small step counts on your wellness journey! 🌱",
    "How has your day been overall? Any highlights or challenges? ✨",
    `Your current wellness journey shows ${checkIns.length} check-ins and ${journalEntries.length} journal entries. Keep it up! 📊`,
    "Would you like to try a quick breathing exercise? It only takes a minute and can really help center your thoughts. 🧘",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

const SUGGESTIONS = [
  "How am I sleeping?",
  "I feel stressed",
  "Tips for better mood",
  "Am I drinking enough water?",
  "What can you do?",
];

const Chat: React.FC = () => {
  const { chatMessages, addChatMessage, checkIns, journalEntries } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: Date.now() };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text, checkIns, journalEntries);
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'ai', content: response, timestamp: Date.now() };
      addChatMessage(aiMsg);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">Chat 💬</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-lg font-semibold mb-2">Welcome to MindAura Chat</p>
            <p className="text-sm text-muted-foreground mb-6">I'm here to listen and help with your wellness journey.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} className="px-4 py-2 rounded-full bg-muted hover:bg-accent/15 text-sm font-medium transition-all">{s}</button>
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
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'accent-gradient text-white rounded-br-md'
                : 'bg-muted rounded-bl-md'
            }`}>
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
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)} className="px-3 py-1.5 rounded-full bg-muted hover:bg-accent/15 text-xs font-medium whitespace-nowrap transition-all">{s}</button>
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
        <button onClick={() => sendMessage(input)} className="btn-primary px-6">Send</button>
      </div>
    </div>
  );
};

export default Chat;
