import { FaLock } from 'react-icons/fa';
import { ICON_MAP } from './iconMap';

export default function BadgeCard({ name, description, icon, rarity, unlocked }) {
  const Icon = ICON_MAP[icon];

  return (
    <div className={`bg-[#fbf7ec] border p-5 text-center transition-shadow ${
      unlocked ? 'border-[#d9cfbb] hover:shadow-md' : 'border-[#d9cfbb] opacity-50'
    }`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border ${
        unlocked ? 'bg-[#ede5ff] text-[#6d28d9] border-[#d9c8ff]' : 'bg-[#f6f1e6] text-[#8a7f72] border-[#d9cfbb]'
      }`}>
        {unlocked && Icon ? <Icon /> : <FaLock />}
      </div>
      <p className="font-semibold text-[#1a1613] text-sm">{name}</p>
      <p className="text-[#4a4038] text-xs mt-1">{description}</p>
      <span className={`inline-block mt-2 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
        unlocked ? 'bg-[#ede5ff] text-[#3a2566]' : 'bg-[#f6f1e6] text-[#8a7f72]'
      }`}>
        {rarity}
      </span>
    </div>
  );
}
