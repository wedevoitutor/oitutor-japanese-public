/**
 * Contact page — /contact
 * Form submits to Supabase contact_messages table.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { submitContactForm } from '../lib/contactService';

const INITIAL = { fullName: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    const { error } = await submitContactForm(form);
    setLoading(false);
    if (error) { setStatus('error'); return; }
    setStatus('success');
    setForm(INITIAL);
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500';

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 relative overflow-hidden">
      {/* Kanji watermarks */}
      <span className="absolute top-20 left-10 text-[14rem] font-black text-white/[.02] select-none pointer-events-none" aria-hidden="true">連</span>
      <span className="absolute bottom-20 right-10 text-[14rem] font-black text-white/[.02] select-none pointer-events-none rotate-12" aria-hidden="true">絡</span>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="card-entrance md:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('contact.fullName')}</label>
              <input type="text" value={form.fullName} onChange={set('fullName')} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('contact.email')}</label>
              <input type="email" value={form.email} onChange={set('email')} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('contact.subject')}</label>
              <input type="text" value={form.subject} onChange={set('subject')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('contact.message')}</label>
              <textarea value={form.message} onChange={set('message')} required rows={5} className={inputCls} />
            </div>

            {status === 'success' && (
              <p className="text-green-700 text-sm bg-green-50 px-3 py-2 rounded-lg">{t('contact.success')}</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{t('contact.error')}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-red-500/20 transition-all disabled:opacity-60"
            >
              {loading ? t('contact.sending') : t('contact.send')}
            </button>
          </form>

          {/* Sidebar */}
          <div className="space-y-6">
            {[
              { icon: <FaEnvelope size={20} />, label: t('contact.emailLabel'), value: 'support@example.com' },
              { icon: <FaWhatsapp size={20} />, label: t('contact.phoneLabel'), value: 'Remote support' },
              { icon: <FaMapMarkerAlt size={20} />, label: t('contact.addressLabel'), value: 'Online' },
            ].map(({ icon, label, value }, i) => (
              <div key={label} className="card-entrance bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex gap-4 items-start hover:bg-white/10 transition-all" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 bg-red-600/20 text-red-400 rounded-xl flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-white/50 text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
