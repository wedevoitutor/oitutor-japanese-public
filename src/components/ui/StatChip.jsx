export default function StatChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700">
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
