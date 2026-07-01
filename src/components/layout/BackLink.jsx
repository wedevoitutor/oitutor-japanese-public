import { Link } from 'react-router-dom';

export default function BackLink({ to, label, className = 'mb-6' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 text-amber-700 text-xs sm:text-sm font-medium hover:text-red-600 transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
}
