export default function InfoBox({ children }) {
  return (
    <div className="bg-amber-100/60 border border-amber-300/60 border-l-4 border-l-red-700 rounded-xl p-4 mb-8 text-sm text-amber-900 leading-relaxed flex items-start gap-3">
      <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-700" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
