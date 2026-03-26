# MindAura – Predictive Mental Wellness Platform

MindAura is an AI‑powered mental health platform that shifts support from reactive to predictive, personalized, and instantly accessible. It features mood tracking, journaling with sentiment analysis, a context‑aware AI chatbot, SOS breathing exercises, gamification (XP, levels, streaks, badges), and interactive analytics – all built with privacy in mind.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend & Auth:** Supabase (PostgreSQL, authentication)
- **State Management:** Zustand
- **Charts:** Recharts
- **Storage:** IndexedDB (local) + Supabase (cloud sync)

## Features

- 🎨 **Dynamic theming** – light/dark mode + customizable accent colour  
- 📅 **Calendar track** – colour‑coded days with daily check‑ins  
- 📝 **Journaling** – guided prompts + on‑device sentiment analysis  
- 💬 **AI Chatbot** – suggestion chips + context‑aware responses (ready for API integration)  
- 📊 **Analytics** – wellness trends, mood distribution, sudden drop detection, year pixel grid  
- 🫁 **SOS** – breathing orb + option to alert a trusted person  
- 🎮 **Gamification** – XP, levels, streaks, badges, avatar customisation  
- 👥 **Multi‑role** – student, faculty, professional dashboards  
- 🔒 **Privacy‑first** – local data storage, opt‑in sync, one‑tap data deletion  

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A Supabase project (free tier works)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mind-aura.git
   cd mind-aura

2. Install dependencies:
   ```bash
   npm install

3. Create a .env file in the project root (based on .env.example) and fill in your Supabase credentials:

   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key   (if needed by the client)

4. Start the development server:

   ```bash
   npm run dev

5. Open http://localhost:8080 in your browser.

### Supabase Setup
1. Create a new Supabase project.

2. In Authentication → Settings, disable email confirmation (or set up your preferred auth method).

3. Run the SQL migration scripts provided in /supabase/migrations to create the required tables (profiles, check_ins, journal_entries, badges, chat_messages, sos_events).