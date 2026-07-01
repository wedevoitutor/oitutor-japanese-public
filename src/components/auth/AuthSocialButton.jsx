import { FaDiscord } from 'react-icons/fa';

/**
 * Dark social auth button for standalone auth pages.
 *
 * @param {{ children: import('react').ReactNode, disabled?: boolean, onClick: () => void }} props
 */
export default function AuthSocialButton({ children, disabled = false, onClick }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-white/14 bg-black/55 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-px hover:border-white/24 hover:bg-[rgba(15,25,48,0.92)] focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/20 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      disabled={disabled}
      onClick={onClick}
    >
      <FaDiscord size={18} aria-hidden="true" />
      {children}
    </button>
  );
}
