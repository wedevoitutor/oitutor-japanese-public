import { FaLock } from 'react-icons/fa';
import { ICON_MAP } from './iconMap';

export default function AchievementCard({ title, description, icon, xpReward, unlocked }) {
  const Icon = ICON_MAP[icon];

  return (
    <div className={`bg-[#fbf7ec] border p-5 flex gap-4 items-start transition-shadow ${
      unlocked ? 'border-[#d9cfbb] hover:shadow-md' : 'border-[#d9cfbb] opacity-50'
    }`}>
      <div className={`w-12 h-12 flex items-center justify-center shrink-0 text-xl border ${
        unlocked ? 'bg-[#ede5ff] text-[#6d28d9] border-[#d9c8ff]' : 'bg-[#f6f1e6] text-[#8a7f72] border-[#d9cfbb]'
      }`}>
        {unlocked && Icon ? <Icon /> : <FaLock />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1a1613] text-sm">{title}</p>
        <p className="text-[#4a4038] text-xs mt-0.5">{description}</p>
      </div>
      <span className="text-xs font-bold text-[#6d28d9] shrink-0 font-mono">+{xpReward} XP</span>
    </div>
  );
}
