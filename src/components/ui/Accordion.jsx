import { useState } from 'react';

export default function Accordion({ header, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`w-full flex items-center gap-4 bg-gradient-to-r from-amber-50/80 to-white border rounded-xl px-5 py-4 text-left font-semibold transition-all shadow-sm hover:from-red-50 hover:to-amber-50/60 hover:border-red-300 ${
          open ? 'border-red-500 from-red-50 to-amber-50/60 rounded-b-none' : 'border-amber-200/80'
        }`}
      >
        <div className="flex-1 flex items-center gap-4">{header}</div>
        <svg
          className={`w-4 h-4 text-red-600 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        } bg-amber-50/40 border border-t-0 border-amber-200/80 rounded-b-xl`}
      >
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
