import { useState, useEffect, useCallback } from 'react';
import {
  getSession,
  getStudentProfile,
  getStudentLessons,
  toggleLessonComplete as apiToggle,
} from '../lib/dashboardService';

/** @returns {{ student, lessons, progress, loading, error, session, toggleLesson }} */
export function useDashboard() {
  const [student, setStudent] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(undefined); // undefined = not yet checked

  useEffect(() => {
    async function load() {
      try {
        const { data: { session: s } } = await getSession();
        setSession(s);
        if (!s) return;

        const [{ data: profile, error: pErr }, { data: ls, error: lErr }] = await Promise.all([
          getStudentProfile(s.user.id),
          getStudentLessons(s.user.id),
        ]);

        if (pErr) throw pErr;
        if (lErr) throw lErr;

        setStudent(profile);
        setLessons((ls ?? []).sort((a, b) => (a.lesson?.order_index ?? 0) - (b.lesson?.order_index ?? 0)));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleLesson = useCallback(async (id, current) => {
    const next = !current;
    setLessons(prev => prev.map(l => l.id === id ? { ...l, completed: next } : l));
    const { error: err } = await apiToggle(id, next);
    if (err) setLessons(prev => prev.map(l => l.id === id ? { ...l, completed: current } : l));
  }, []);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = {
    total: lessons.length,
    completed: completedCount,
    remaining: lessons.length - completedCount,
    percentage: lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0,
  };

  return { student, lessons, progress, loading, error, session, toggleLesson };
}
