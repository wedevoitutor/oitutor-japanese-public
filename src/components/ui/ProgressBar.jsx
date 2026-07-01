export default function ProgressBar({ current, total, className = '' }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full bg-[#d9cfbb] h-2.5 ${className}`}>
      <div
        className="bg-[#7c3aed] h-2.5 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
