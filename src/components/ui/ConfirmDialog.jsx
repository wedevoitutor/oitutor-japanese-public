import { useEffect } from 'react';
import Button from './Button';

/**
 * Modal confirmation dialog. Click on the backdrop or press Escape to cancel.
 *
 * @param {object} props
 * @param {boolean}               props.open
 * @param {string}                props.title
 * @param {string|React.ReactNode} props.message
 * @param {string}                props.confirmLabel
 * @param {string}     props.cancelLabel
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-[nav-overlay-in_0.2s_ease-out]"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-amber-200/40 p-6 md:p-7 bubble-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg md:text-xl font-bold text-amber-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
