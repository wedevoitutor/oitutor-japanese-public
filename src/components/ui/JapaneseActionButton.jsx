import { Link } from 'react-router-dom';

const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variantClasses = {
  ink: 'border-[#1a1613] bg-[#1a1613] text-[#fbf7ec] shadow-sm shadow-[#1a1613]/20 hover:-translate-y-0.5 hover:bg-[#2a241f] focus:ring-[#1a1613]',
  washi: 'border-[#d9cfbb] bg-[#fbf7ec] text-[#1a1613] shadow-sm shadow-[#1a1613]/10 hover:-translate-y-0.5 hover:border-[#c03a2b] hover:text-[#c03a2b] focus:ring-[#c03a2b]',
  vermilion: 'border-[#9f2f24] bg-[#c03a2b] text-white shadow-sm shadow-[#c03a2b]/25 hover:-translate-y-0.5 hover:bg-[#a83228] focus:ring-[#c03a2b]',
  gold: 'border-[#b98a2e] bg-[#f8d36b] text-[#1a1613] shadow-sm shadow-[#b98a2e]/25 hover:-translate-y-0.5 hover:bg-[#f2c24c] focus:ring-[#b98a2e]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

/**
 * Shared Japanese-inspired action button for auth and premium CTAs.
 *
 * @param {{ to?: string, href?: string, type?: 'button' | 'submit', variant?: 'ink' | 'washi' | 'vermilion' | 'gold', size?: 'sm' | 'md' | 'lg', className?: string, children: import('react').ReactNode }} props
 */
export default function JapaneseActionButton({
  to,
  href,
  type = 'button',
  variant = 'ink',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }

  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
