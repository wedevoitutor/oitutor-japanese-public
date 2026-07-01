import RingGauge from '../ui/RingGauge';

const CARD_THEME = {
  alphabets: { gradient: 'from-rose-500 to-red-700',      glow: 'shadow-rose-500/40' },
  kanji:     { gradient: 'from-indigo-500 to-blue-700',   glow: 'shadow-indigo-500/40' },
  lessons:   { gradient: 'from-teal-500 to-emerald-700',  glow: 'shadow-teal-500/40' },
  grammar:   { gradient: 'from-violet-500 to-purple-700', glow: 'shadow-violet-500/40' },
};

export function getCardTheme(pathId) {
  return CARD_THEME[pathId] ?? CARD_THEME.alphabets;
}

export default function PathCard({ path, pct, done, total, locked = false, center = false }) {
  const theme = getCardTheme(path.id);
  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${theme.gradient} text-white text-left shadow-xl ${theme.glow}`}
    >
      <span
        className="absolute -right-1 -bottom-3 text-[4.5rem] leading-none font-black opacity-[.08] select-none pointer-events-none"
        aria-hidden="true"
      >
        {path.titleJp}
      </span>

      {locked && (
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20">
          <span className="text-3xl drop-shadow-lg">🔒</span>
        </div>
      )}

      <div className={`relative z-10 flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <RingGauge pct={pct} />
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight truncate">{path.label}</p>
          <p className="text-[11px] opacity-70 mt-0.5">{done}/{total} skills</p>
        </div>
      </div>
    </div>
  );
}
