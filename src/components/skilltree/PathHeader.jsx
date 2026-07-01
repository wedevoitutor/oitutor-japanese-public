import { PROGRESS_THEME } from './scrollPathConfigs';

export default function PathHeader({ title, completedText, progressLabel, completed, total, sakuraLabel, themeId = 'alphabets' }) {
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const theme = PROGRESS_THEME[themeId] ?? PROGRESS_THEME.alphabets;
  const completeGlow = pct >= 100 ? `shadow-lg ${theme.glow}` : '';

  return (
    <header className="mb-5 rounded-[1.75rem] border border-[#eadbc7] bg-[#fffaf0]/90 px-5 py-5 shadow-[0_18px_50px_rgba(69,46,28,0.10)] backdrop-blur md:px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight text-[#2f251d] md:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#806b55]">{completedText}</p>
        </div>
        <button
          type="button"
          aria-label={sakuraLabel}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#efd4d5] bg-[#fff5f6] text-[#c84a5f] shadow-[0_10px_30px_rgba(200,74,95,0.16)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9412e] focus:ring-offset-2 focus:ring-offset-[#fffaf0]"
        >
          <span aria-hidden="true" className="text-lg font-black leading-none">桜</span>
        </button>
      </div>

      <div className="mt-5" aria-label={progressLabel}>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfcf]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-[width,box-shadow] duration-700 ${completeGlow}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </header>
  );
}
