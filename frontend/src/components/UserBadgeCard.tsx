import { loadProgress, getCurrentLevel, getNextLevel, getProgressPct, BADGES } from '../store/gamification';
import { Shield, Star } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function UserBadgeCard() {
  const p = loadProgress();

  if (p.totalReports === 0) return null;

  const currentLevel = getCurrentLevel(p.points);
  const nextLevel = getNextLevel(p.points);
  const pct = getProgressPct(p.points);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200">
      
      {/* Top Row */}
      <div className="flex items-center gap-3">
        <div className={cn("w-11 h-11 rounded-full flex items-center justify-center border", currentLevel.color, currentLevel.textColor, currentLevel.borderColor)}>
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-bold text-slate-900">{currentLevel.name}</div>
          <div className="text-[12px] text-slate-500 font-medium">
            {p.points} point • {p.totalReports} xabar
          </div>
        </div>
        {p.streak > 0 && (
          <div className="flex flex-col items-center justify-center p-2 bg-orange-50 border border-orange-100 rounded-lg">
            <span className="text-[10px] text-orange-600/70 font-bold uppercase tracking-wider leading-none mb-1">Streak</span>
            <span className="text-sm font-bold text-orange-600 leading-none">{p.streak}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {nextLevel && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className={cn(currentLevel.textColor)}>{currentLevel.name}</span>
            <span className="text-slate-500">{p.points} / {nextLevel.minPoints}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-700 ease-out" 
              style={{ width: `${pct}%` }} 
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center">
            Keyingi: <span className="font-semibold text-slate-600 ml-1">{nextLevel.name}</span>
            <span className="mx-1.5">&mdash;</span>
            yana {nextLevel.minPoints - p.points} point
          </div>
        </div>
      )}

      {/* Earned Badges Row */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          <Star className="w-3.5 h-3.5" />
          Medallar
        </div>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((badge) => {
            const isEarned = p.points >= badge.minPoints;
            return (
              <div 
                key={badge.id}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-full border",
                  isEarned 
                    ? `${badge.color} ${badge.textColor} ${badge.borderColor}` 
                    : "bg-slate-50 text-slate-400 border-slate-200"
                )}
              >
                {badge.name}
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
