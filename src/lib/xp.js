export const XP_PER_TYPE = {
  study: 15,
  practice: 25,
  grammar: 30,
  dialogue: 35,
  review: 50,
};

export function calcXP(lessonType, perfectScore = false) {
  const base = XP_PER_TYPE[lessonType] ?? 20;
  return perfectScore ? Math.round(base * 1.5) : base;
}
