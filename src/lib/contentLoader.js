const modules = import.meta.glob('../content/**/*.json');

export const AVAILABLE_CONTENT_FILES = new Set(
  Object.keys(modules).map((k) => k.replace('../content/', '')),
);

export async function loadLesson(contentFile) {
  const path = `../content/${contentFile}`;
  const loader = modules[path];
  if (!loader) throw new Error(`Lesson not found: ${contentFile}`);
  const mod = await loader();
  return mod.default;
}
