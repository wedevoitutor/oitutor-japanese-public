const LEGACY_STORAGE_KEY = 'oitutor_progress';
const ANON_STORAGE_KEY = 'oitutor_progress:anon';
const USER_STORAGE_PREFIX = 'oitutor_progress:user:';
let activeStorageKey = ANON_STORAGE_KEY;

const DEFAULT_PROGRESS = {
  lessons: {},
  xp: 0,
  streak: { count: 0, lastDate: null },
  achievements: {},  // { [id]: dateUnlocked }
  badges: {},        // { [id]: dateUnlocked }
};

export function normalizeProgress(progress = {}) {
  return {
    lessons: progress.lessons ?? {},
    xp: Number(progress.xp ?? 0),
    streak: {
      count: Number(progress.streak?.count ?? 0),
      lastDate: progress.streak?.lastDate ?? null,
    },
    achievements: progress.achievements ?? {},
    badges: progress.badges ?? {},
  };
}

export function getProgressStorageKey(studentId = null) {
  return studentId ? `${USER_STORAGE_PREFIX}${studentId}` : ANON_STORAGE_KEY;
}

export function setProgressStorageOwner(studentId = null) {
  activeStorageKey = getProgressStorageKey(studentId);
}

function readStoredProgress(storageKey) {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function getProgress() {
  try {
    const stored = readStoredProgress(activeStorageKey) || {};
    return normalizeProgress({ ...DEFAULT_PROGRESS, ...stored });
  } catch {
    return normalizeProgress(DEFAULT_PROGRESS);
  }
}

export function saveProgress(progress) {
  const normalized = normalizeProgress(progress);
  localStorage.setItem(activeStorageKey, JSON.stringify(normalized));
  return normalized;
}

export function resetProgress() {
  localStorage.removeItem(activeStorageKey);
  return getProgress();
}

export function clearLegacyProgress() {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function completeLesson(lessonId, xpEarned) {
  const progress = getProgress();
  const wasCompleted = !!progress.lessons[lessonId]?.completed;
  progress.lessons[lessonId] = {
    completed: true,
    completedAt: new Date().toISOString(),
    xp: xpEarned,
  };

  if (wasCompleted) return saveProgress(progress);

  progress.xp += xpEarned;

  // Streak logic
  const today = new Date().toISOString().slice(0, 10);
  if (progress.streak.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    progress.streak.count =
      progress.streak.lastDate === yesterday ? progress.streak.count + 1 : 1;
    progress.streak.lastDate = today;
  }

  return saveProgress(progress);
}

export function unlockAchievement(id) {
  const progress = getProgress();
  if (progress.achievements[id]) return progress;
  progress.achievements[id] = new Date().toISOString();
  return saveProgress(progress);
}

export function unlockBadge(id) {
  const progress = getProgress();
  if (progress.badges[id]) return progress;
  progress.badges[id] = new Date().toISOString();
  return saveProgress(progress);
}

export function isLessonUnlocked(lessonId, allLessonsOrdered) {
  const progress = getProgress();
  const idx = allLessonsOrdered.indexOf(lessonId);
  if (idx <= 0) return true; // first lesson always unlocked
  return !!progress.lessons[allLessonsOrdered[idx - 1]]?.completed;
}

export function getLessonStatus(lessonId, allLessonsOrdered) {
  const progress = getProgress();
  if (progress.lessons[lessonId]?.completed) return 'completed';
  if (isLessonUnlocked(lessonId, allLessonsOrdered)) return 'available';
  return 'locked';
}
