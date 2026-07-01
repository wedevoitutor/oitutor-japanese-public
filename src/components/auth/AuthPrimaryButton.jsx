/**
 * Primary submit button for standalone auth forms.
 *
 * @param {{ children: import('react').ReactNode, disabled?: boolean, type?: 'button' | 'submit' }} props
 */
export default function AuthPrimaryButton({ children, disabled = false, type = 'submit' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-[14px] border border-[#ff756b]/25 bg-gradient-to-b from-[#ef4a3a] to-[#c8342a] px-5 py-3 text-center text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(239,74,58,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 hover:-translate-y-px hover:from-[#ff5848] hover:to-[#d83b30] hover:shadow-[0_16px_34px_rgba(239,74,58,0.34),inset_0_1px_0_rgba(255,255,255,0.2)] focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/22 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:from-[#ef4a3a] disabled:hover:to-[#c8342a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {children}
    </button>
  );
}
