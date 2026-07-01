import { useTranslation } from 'react-i18next';

/** Torii gate progress visualization with wooden plaque stats. */
export default function ToriiProgress({ completed, remaining, total, percentage }) {
  const { t } = useTranslation();

  const stats = [
    { val: completed, label: t('portal.completed'), color: 'text-[#3a6b3a]' },
    { val: remaining, label: t('portal.remaining'), color: 'text-[#6d28d9]' },
    { val: total, label: t('portal.total'), color: 'text-[#1a1613]' },
  ];

  return (
    <div className="bg-[#fbf7ec]/90 backdrop-blur-sm p-4 md:p-6 shadow-md border border-[#1a1613] relative overflow-hidden">
      <span className="absolute -right-2 -bottom-4 text-6xl md:text-7xl font-black text-[#6d28d9]/[.06] select-none font-serif" aria-hidden="true">学</span>

      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="font-semibold text-[#1a1613] text-sm md:text-base font-serif tracking-wide">{t('portal.yourProgress')}</h2>
        <span className="text-xl md:text-2xl font-extrabold text-[#6d28d9] font-mono">{percentage}%</span>
      </div>

      {/* Torii gate bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between mb-1">
          <div className="w-1.5 md:w-2 h-3 md:h-4 bg-[#6d28d9]" />
          <div className="w-1.5 md:w-2 h-3 md:h-4 bg-[#6d28d9]" />
        </div>
        <div className="w-full bg-[#d9cfbb] h-2.5 md:h-3 overflow-hidden">
          <div
            className="bg-[#7c3aed] h-full torii-fill transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <div className="w-1.5 md:w-2 h-2.5 md:h-3 bg-[#6d28d9]" />
          <div className="w-1.5 md:w-2 h-2.5 md:h-3 bg-[#6d28d9]" />
        </div>
      </div>

      {/* Wooden plaque stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
        {stats.map(({ val, label, color }) => (
          <div key={label} className="bg-[#f6f1e6] py-2 md:py-3 px-1.5 md:px-2 border border-[#d9cfbb] shadow-sm">
            <p className={`text-xl md:text-2xl font-bold font-mono ${color}`}>{val}</p>
            <p className="text-[#8a7f72] text-[10px] md:text-xs font-mono uppercase tracking-[0.1em]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
