const zoneRules = [
  { zone: 'canopy', maxRows: 3 },
  { zone: 'trunk', maxRows: 3 },
  { zone: 'roots', maxRows: Infinity },
];

export function chunkByPattern(items, pattern) {
  const rows = [];
  let itemIndex = 0;
  let patternIndex = 0;

  while (itemIndex < items.length) {
    const count = pattern[patternIndex % pattern.length];
    rows.push({
      pattern: count,
      items: items.slice(itemIndex, itemIndex + count),
    });
    itemIndex += count;
    patternIndex += 1;
  }

  return rows;
}

export function chunkBySections(items, sections, fallbackPattern) {
  const rows = [];
  let itemIndex = 0;

  sections.forEach((section) => {
    let sectionRowIndex = 0;
    while (itemIndex < items.length) {
      const row = section.rows[sectionRowIndex % section.rows.length];
      if (!section.repeat && sectionRowIndex >= section.rows.length) break;

      const count = row.pattern;
      rows.push({
        zone: section.zone,
        pattern: count,
        items: items.slice(itemIndex, itemIndex + count),
      });
      itemIndex += count;
      sectionRowIndex += 1;

      if (!section.repeat && sectionRowIndex >= section.rows.length) break;
    }
  });

  const fallbackRows = itemIndex < items.length
    ? chunkByPattern(items.slice(itemIndex), fallbackPattern).map((row, index) => ({
        ...row,
        zone: resolveZone(rows.length + index),
      }))
    : [];

  return [...rows, ...fallbackRows].filter((row) => row.items.length > 0);
}

export function resolveZone(rowIndex) {
  let cursor = 0;
  const match = zoneRules.find((rule) => {
    const next = cursor + rule.maxRows;
    const isMatch = rowIndex >= cursor && rowIndex < next;
    cursor = next;
    return isMatch;
  });

  return match?.zone ?? 'roots';
}

export function applySequentialProgress(lessons, lessonProgress = {}) {
  const routableLessons = lessons.filter(
    (lesson) => lesson.lessonId && (lesson.route || (lesson.sectionSlug && lesson.lessonSlug)),
  );
  let currentAssigned = false;

  return lessons.map((lesson, visualIndex) => {
    const route = lesson.sectionSlug && lesson.lessonSlug
      ? `/curriculum/${lesson.sectionSlug}/${lesson.lessonSlug}`
      : lesson.route;
    const routableIndex = routableLessons.findIndex((item) => item.id === lesson.id);
    const previousLesson = routableIndex > 0 ? routableLessons[routableIndex - 1] : null;
    const completed = !!lesson.lessonId && !!lessonProgress[lesson.lessonId]?.completed;

    if (!lesson.lessonId || !route) {
      return { ...lesson, route: null, visualIndex, status: 'locked' };
    }

    if (completed) {
      return { ...lesson, route, visualIndex, status: 'completed' };
    }

    const prerequisiteMet = !previousLesson || !!lessonProgress[previousLesson.lessonId]?.completed;
    if (prerequisiteMet && !currentAssigned) {
      currentAssigned = true;
      return { ...lesson, route, visualIndex, status: 'current' };
    }

    if (prerequisiteMet) {
      return { ...lesson, route, visualIndex, status: 'available' };
    }

    return { ...lesson, route, visualIndex, status: 'locked' };
  });
}

export function getPathProgress(lessons) {
  return {
    completed: lessons.filter((lesson) => lesson.status === 'completed').length,
    total: lessons.length,
  };
}
