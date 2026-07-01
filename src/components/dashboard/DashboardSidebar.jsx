import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoSensei from '../../assets/logo-sensei.png';

const NAV_ITEMS = [
  { to: '#lessons', icon: '読', key: 'portal.navLessons', active: true },
  { to: '/curriculum', icon: '文', key: 'portal.navMaterials' },
  { to: '/skilltree', icon: '道', key: 'portal.navSkillTree' },
  { to: '/dictionary', icon: '辞', key: 'portal.navDictionary' },
  { to: '/profile', icon: '我', key: 'portal.navProfile' },
];

/** Desktop sidebar + mobile bottom nav. */
export default function DashboardSidebar({ balance }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-[#ede5ff] text-[#1a1613] flex-col shrink-0 sticky top-0 h-screen z-10 border-r border-[#d9c8ff] shadow-[inset_-1px_0_0_rgba(124,58,237,0.08)]">
        <div className="px-5 py-4 border-b border-[#d9c8ff] bg-[#fbf7ec]/55">
          <Link to="/"><img src={logoSensei} alt="OiTutor" className="h-10" /></Link>
          <span className="block text-[#3a2566] text-[10px] mt-2 uppercase tracking-[0.22em] font-mono">{t('portal.brand')}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {NAV_ITEMS.map(({ to, icon, key, active }) => (
            <NavLink key={to} to={to} icon={icon} label={t(key)} active={active} />
          ))}
          <a
            href="/contact"
            className="flex items-center gap-3 px-3 py-2 text-[#3a2566] hover:bg-[#d9c8ff] hover:text-[#1a1613] hover:translate-x-1 transition-all duration-200"
          >
            <span className="font-serif text-[#6d28d9]">予</span> {t('portal.navBook')}
            <span className="ml-auto text-xs text-[#8a7f72]">↗</span>
          </a>
        </nav>

        <div className="px-5 py-4 border-t border-[#d9c8ff] bg-[#fbf7ec]/55">
          <p className="text-[10px] text-[#3a2566] mb-1 uppercase tracking-[0.18em] font-mono">{t('portal.daysRemaining')}</p>
          <p className="text-2xl font-semibold text-[#6d28d9] font-serif">{balance ?? '--'}</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-[#ede5ff] border-t border-[#d9c8ff] flex justify-around py-2 px-1 shadow-[0_-4px_12px_rgba(26,22,19,0.08)]">
        {NAV_ITEMS.map(({ to, icon, key, active }) => {
          const Tag = to.startsWith('#') ? 'a' : Link;
          const linkProp = to.startsWith('#') ? { href: to } : { to };
          return (
            <Tag
              key={to}
              {...linkProp}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors ${
                active ? 'text-[#6d28d9]' : 'text-[#4a4038]'
              }`}
            >
              <span className="text-lg font-serif">{icon}</span>
              <span>{t(key)}</span>
            </Tag>
          );
        })}
      </nav>
    </>
  );
}

function NavLink({ to, icon, label, active }) {
  const cls = active
    ? 'bg-[#6d28d9] text-white'
    : 'text-[#3a2566] hover:bg-[#d9c8ff] hover:text-[#1a1613] hover:translate-x-1';
  const Tag = to.startsWith('#') ? 'a' : Link;
  const linkProp = to.startsWith('#') ? { href: to } : { to };

  return (
    <Tag {...linkProp} className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${cls}`}>
      <span className="font-serif text-base">{icon}</span> {label}
    </Tag>
  );
}
