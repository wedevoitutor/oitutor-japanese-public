import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  getProgress,
  completeLesson as completeLessonLib,
  getLessonStatus,
  saveProgress,
  normalizeProgress,
  resetProgress,
  setProgressStorageOwner,
  clearLegacyProgress,
} from '../lib/progress';
import { fetchRemoteProgress, pushRemoteProgress } from '../lib/progressSync';
import { useSession } from '../hooks/useSession';
import { getLevelProgress } from '../lib/levels';
import { ACHIEVEMENTS } from '../lib/achievements';
import { BADGES } from '../lib/badges';
import { evaluateAchievements } from '../lib/achievementEvaluator';
import { evaluateBadges } from '../lib/badgeEvaluator';

const ProgressContext = createContext();

function addAchievementsWithRewards(progress, ids, includeRewards = true) {
  const current = normalizeProgress(progress);
  const next = {
    ...current,
    achievements: { ...current.achievements },
  };
  const unlockedAt = new Date().toISOString();

  for (const id of ids) {
    if (next.achievements[id]) continue;
    next.achievements[id] = unlockedAt;
    if (includeRewards) {
      next.xp += ACHIEVEMENTS.find((achievement) => achievement.id === id)?.xpReward ?? 0;
    }
  }

  return next;
}

function addBadges(progress, ids) {
  const current = normalizeProgress(progress);
  const next = {
    ...current,
    badges: { ...current.badges },
  };
  const unlockedAt = new Date().toISOString();

  for (const id of ids) {
    if (next.badges[id]) continue;
    next.badges[id] = unlockedAt;
  }

  return next;
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(getProgress);
  const session = useSession();
  const studentId = session?.user?.id ?? null;

  // Apply a local mutation and fire-and-forget the sync.
  const applyAndSync = useCallback((updated) => {
    const normalized = saveProgress(updated);
    setProgress({ ...normalized });
    if (studentId) pushRemoteProgress(studentId, normalized);
  }, [studentId]);

  // On auth changes: switch local cache scopes, then sync signed-in users.
  useEffect(() => {
    if (session === undefined) return;

    if (!studentId) {
      setProgressStorageOwner(null);
      clearLegacyProgress();
      setProgress(getProgress());
      return;
    }

    let ignore = false;
    setProgressStorageOwner(studentId);
    clearLegacyProgress();
    fetchRemoteProgress(studentId).then((remote) => {
      if (ignore) return;
      const current = remote ? normalizeProgress(remote) : getProgress();
      const earnedBadges = evaluateBadges(current, { isAuthenticated: true });
      const synced = earnedBadges.length ? addBadges(current, earnedBadges) : current;
      applyAndSync(synced);
    });

    return () => {
      ignore = true;
    };
  }, [applyAndSync, session, studentId]);

  const complete = useCallback(
    (lessonId, xpEarned, isPerfect = false) => {
      const completedAt = new Date();
      let current = completeLessonLib(lessonId, xpEarned);
      const earnedAchievements = evaluateAchievements(current, isPerfect);
      current = addAchievementsWithRewards(current, earnedAchievements);
      const earnedBadges = evaluateBadges(current, {
        isAuthenticated: !!studentId,
        completedAt,
      });
      current = addBadges(current, earnedBadges);
      applyAndSync(current);
    },
    [applyAndSync, studentId],
  );

  const unlockAchievement = useCallback(
    (id) => applyAndSync(addAchievementsWithRewards(getProgress(), [id], false)),
    [applyAndSync],
  );

  const unlockBadge = useCallback(
    (id) => applyAndSync(addBadges(getProgress(), [id])),
    [applyAndSync],
  );

  const status = useCallback(
    (lessonId, allLessonsOrdered) => getLessonStatus(lessonId, allLessonsOrdered),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress],
  );

  const reset = useCallback(() => {
    const fresh = resetProgress();
    setProgress(fresh);
    if (studentId) pushRemoteProgress(studentId, fresh);
  }, [studentId]);

  const levelProgress = useMemo(() => getLevelProgress(progress.xp), [progress.xp]);

  const achievements = useMemo(
    () => ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: !!progress.achievements[a.id],
      dateUnlocked: progress.achievements[a.id] || null,
    })),
    [progress.achievements],
  );

  const badges = useMemo(
    () => BADGES.map((b) => ({
      ...b,
      unlocked: !!progress.badges[b.id],
      dateUnlocked: progress.badges[b.id] || null,
    })),
    [progress.badges],
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson: complete,
        getLessonStatus: status,
        reset,
        levelProgress,
        achievements,
        badges,
        unlockAchievement,
        unlockBadge,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider');
  return ctx;
}
