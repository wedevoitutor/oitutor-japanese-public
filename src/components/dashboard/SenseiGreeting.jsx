import { useTranslation } from 'react-i18next';

function getGreetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'portal.greetingMorning';
  if (h < 18) return 'portal.greetingAfternoon';
  return 'portal.greetingEvening';
}

/** Time-based Japanese greeting with user name. */
export default function SenseiGreeting({ name }) {
  const { t } = useTranslation();

  return (
    <div className="bubble-in">
      <p className="text-lg md:text-xl font-semibold text-[#1a1613] font-serif">{t(getGreetingKey())}</p>
      <p className="text-xs md:text-sm text-[#6d28d9] font-mono uppercase tracking-[0.12em]">{name}</p>
    </div>
  );
}
