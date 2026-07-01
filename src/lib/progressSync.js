/**
 * Supabase adapter for the `user_progress` table.
 * Keeps localStorage as the in-memory source of truth; this module only
 * handles the remote pull/push so ProgressContext stays thin.
 */
import { supabase } from './supabase';
import { normalizeProgress } from './progress';

const rowToProgress = (row) => normalizeProgress({
  xp: row.xp ?? 0,
  streak: { count: row.streak_count ?? 0, lastDate: row.streak_last_date },
  lessons: row.lessons ?? {},
  achievements: row.achievements ?? {},
  badges: row.badges ?? {},
});

const progressToRow = (studentId, p) => ({
  student_id: studentId,
  xp: p.xp,
  streak_count: p.streak?.count ?? 0,
  streak_last_date: p.streak?.lastDate ?? null,
  lessons: p.lessons ?? {},
  achievements: p.achievements ?? {},
  badges: p.badges ?? {},
  updated_at: new Date().toISOString(),
});

export async function fetchRemoteProgress(studentId) {
  if (!supabase || !studentId) return null;
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('student_id', studentId)
    .maybeSingle();
  if (error) { console.error('fetchRemoteProgress:', error.message); return null; }
  return data ? rowToProgress(data) : null;
}

export async function pushRemoteProgress(studentId, progress) {
  if (!supabase || !studentId) return;
  const { error } = await supabase
    .from('user_progress')
    .upsert(progressToRow(studentId, progress), { onConflict: 'student_id' });
  if (error) console.error('pushRemoteProgress:', error.message);
}
