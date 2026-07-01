const VARIANTS = {
  primary: 'bg-[#1a1613] text-[#f6f1e6] hover:bg-[#6d28d9] shadow-md',
  secondary: 'bg-transparent text-[#1a1613] border border-[#1a1613] hover:bg-[#ede5ff]',
  success: 'bg-[#3a6b3a] text-white hover:brightness-110',
  locked: 'bg-slate-100 text-slate-400 cursor-not-allowed',
};

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-sm transition-all uppercase tracking-[0.08em] ${
        VARIANTS[variant] || VARIANTS.primary
      } ${className}`}
      disabled={variant === 'locked'}
      {...props}
    >
      {children}
    </button>
  );
}
