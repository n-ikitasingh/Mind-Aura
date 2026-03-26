-- Drop all existing policies and recreate with proper role targeting

-- profiles
DROP POLICY "Users can view own profile" ON public.profiles;
DROP POLICY "Users can insert own profile" ON public.profiles;
DROP POLICY "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- check_ins
DROP POLICY "Users can view own check_ins" ON public.check_ins;
DROP POLICY "Users can insert own check_ins" ON public.check_ins;
CREATE POLICY "Users can view own check_ins" ON public.check_ins FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own check_ins" ON public.check_ins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- journal_entries
DROP POLICY "Users can view own journal" ON public.journal_entries;
DROP POLICY "Users can insert own journal" ON public.journal_entries;
DROP POLICY "Users can delete own journal" ON public.journal_entries;
CREATE POLICY "Users can view own journal" ON public.journal_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON public.journal_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal" ON public.journal_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- badges
DROP POLICY "Users can view own badges" ON public.badges;
DROP POLICY "Users can insert own badges" ON public.badges;
CREATE POLICY "Users can view own badges" ON public.badges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.badges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- chat_messages
DROP POLICY "Users can view own chats" ON public.chat_messages;
DROP POLICY "Users can insert own chats" ON public.chat_messages;
CREATE POLICY "Users can view own chats" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- sos_events
DROP POLICY "Users can view own sos" ON public.sos_events;
DROP POLICY "Users can insert own sos" ON public.sos_events;
CREATE POLICY "Users can view own sos" ON public.sos_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sos" ON public.sos_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);