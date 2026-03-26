import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, type JournalEntry } from '@/store/useStore';
import { analyzeSentiment, JOURNAL_PROMPTS } from '@/lib/wellness';

const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry, addXP, checkIns } = useStore();
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Generate contextual prompt based on recent data
  const getContextualPrompt = () => {
    const recent = checkIns[checkIns.length - 1];
    if (recent?.mood === 'low' || recent?.mood === 'awful') {
      return "You had a tough day recently – what's one small thing that went well today?";
    }
    return JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: today,
      content: content.trim(),
      sentiment: analyzeSentiment(content),
      timestamp: Date.now(),
    };
    addJournalEntry(entry);
    addXP(20);
    setContent('');
    setPrompt(getContextualPrompt());
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => setContent(prev => prev + ' ' + e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const sentimentEmoji = { positive: '😊', neutral: '😐', negative: '😔' };
  const filtered = journalEntries.filter(e => !search || e.content.toLowerCase().includes(search.toLowerCase())).reverse();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Journal 📝</h1>

      {/* Prompt */}
      <motion.div className="bg-card rounded-2xl p-5 border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-muted-foreground mb-1">Today's prompt:</p>
        <p className="text-lg font-semibold mb-4 italic">"{prompt}"</p>
        <button onClick={() => setPrompt(getContextualPrompt())} className="text-xs text-muted-foreground hover:text-foreground transition-colors">🔄 New prompt</button>
      </motion.div>

      {/* Editor */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing..."
          className="input-field min-h-[200px] resize-none mb-3"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={startVoiceInput} className={`btn-ghost text-sm ${isListening ? 'text-destructive animate-pulse' : ''}`}>
              {isListening ? '⏹️ Listening...' : '🎤 Voice'}
            </button>
            {content && (
              <span className="badge">
                {sentimentEmoji[analyzeSentiment(content)]} {analyzeSentiment(content)}
              </span>
            )}
          </div>
          <button onClick={handleSubmit} disabled={!content.trim()} className="btn-primary disabled:opacity-40">
            Save Entry (+20 XP)
          </button>
        </div>
      </div>

      {/* Past entries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Past Entries</h2>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-48 text-sm py-2"
          />
        </div>
        <div className="space-y-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No entries yet.</p>}
          {filtered.map(entry => (
            <motion.div key={entry.id} className="bg-card rounded-xl p-4 border border-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()} · {new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className="badge text-xs">{sentimentEmoji[entry.sentiment]} {entry.sentiment}</span>
              </div>
              <p className="text-sm">{entry.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
