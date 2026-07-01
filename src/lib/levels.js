/**
 * Level system (1–999) based on quadratic XP curve.
 * Level 1 = 0 XP (everyone starts at level 1).
 * Formula: xpRequired(level) = 75 * (level - 1)^2
 * Level 2 = 75 XP, Level 10 = 6075 XP, Level 50 = 180,675 XP
 */

export const xpRequiredForLevel = (level) => Math.floor(75 * (level - 1) * (level - 1));

export function getCurrentLevel(totalXP) {
  // Inverse of 75 * (level-1)^2: level = floor(sqrt(xp / 75)) + 1
  const level = Math.floor(Math.sqrt(totalXP / 75)) + 1;
  return Math.min(level, 999);
}

export function getLevelProgress(totalXP) {
  const currentLevel = getCurrentLevel(totalXP);
  const currentThreshold = xpRequiredForLevel(currentLevel);
  const nextThreshold = xpRequiredForLevel(currentLevel + 1);
  const xpIntoCurrentLevel = totalXP - currentThreshold;
  const xpNeededForNextLevel = nextThreshold - currentThreshold;

  return {
    currentLevel,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage: Math.min(100, Math.round((xpIntoCurrentLevel / xpNeededForNextLevel) * 100)),
  };
}
