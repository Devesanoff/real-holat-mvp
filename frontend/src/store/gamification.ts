export interface Badge {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  color: string;
  textColor: string;
  borderColor: string;
}

export interface UserProgress {
  points: number;
  totalReports: number;
  reportsWithPhoto: number;
  streak: number;
  lastReportDate: string;
  earnedBadgeIds: string[];
}

export const BADGES: Badge[] = [
  {
    id: "newcomer",
    name: "Yangi inspektor",
    description: "Birinchi xabarni yubordi",
    minPoints: 0,
    color: "bg-amber-50",
    textColor: "text-amber-800",
    borderColor: "border-amber-300"
  },
  {
    id: "active",
    name: "Faol fuqaro",
    description: "5 ta muassasani tekshirdi",
    minPoints: 50,
    color: "bg-slate-50",
    textColor: "text-slate-800",
    borderColor: "border-slate-300"
  },
  {
    id: "mahalla",
    name: "Mahalla kuzatuvchisi",
    description: "15+ xabar, 3+ tumanda",
    minPoints: 150,
    color: "bg-amber-100",
    textColor: "text-amber-900",
    borderColor: "border-amber-400"
  },
  {
    id: "city",
    name: "Shahar inspektori",
    description: "40+ xabar, 5+ tumanda",
    minPoints: 400,
    color: "bg-blue-50",
    textColor: "text-blue-800",
    borderColor: "border-blue-300"
  },
  {
    id: "hero",
    name: "Shaffoflik qahramoni",
    description: "Eng faol fuqaro — 1000+ point",
    minPoints: 1000,
    color: "bg-purple-50",
    textColor: "text-purple-800",
    borderColor: "border-purple-300"
  }
];

export const POINT_VALUES = {
  report: 10,
  reportWithPhoto: 20,
  problemFound: 15,
  streak: 5
};

const STORAGE_KEY = 'realholat_progress';

const defaultProgress: UserProgress = {
  points: 0,
  totalReports: 0,
  reportsWithPhoto: 0,
  streak: 0,
  lastReportDate: "",
  earnedBadgeIds: ["newcomer"]
};

export const loadProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { ...defaultProgress };
};

export const saveProgress = (p: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (e) {}
};

export const getCurrentLevel = (points: number): Badge => {
  // Return highest badge where its minPoints <= points
  const earned = BADGES.filter(b => b.minPoints <= points);
  return earned[earned.length - 1] || BADGES[0];
};

export const getNextLevel = (points: number): Badge | null => {
  const next = BADGES.find(b => b.minPoints > points);
  return next || null;
};

export const getProgressPct = (points: number): number => {
  const current = getCurrentLevel(points);
  const next = getNextLevel(points);
  if (!next) return 100;
  
  const span = next.minPoints - current.minPoints;
  const progress = points - current.minPoints;
  return Math.max(0, Math.min(100, Math.round((progress / span) * 100)));
};

export const addReportPoints = (hasPhoto: boolean, isProblematic: boolean) => {
  const p = loadProgress();
  
  // Calculate points
  const base = hasPhoto ? POINT_VALUES.reportWithPhoto : POINT_VALUES.report;
  const problemBonus = isProblematic ? POINT_VALUES.problemFound : 0;
  
  // Streak logic
  let streakBonus = 0;
  const today = new Date().toISOString().split('T')[0];
  
  if (p.lastReportDate) {
    const lastD = new Date(p.lastReportDate);
    const currD = new Date(today);
    const diffDays = Math.floor((currD.getTime() - lastD.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      p.streak += 1;
      streakBonus = POINT_VALUES.streak;
    } else if (diffDays > 1) {
      p.streak = 1;
    }
  } else {
    p.streak = 1;
  }
  p.lastReportDate = today;
  
  const earnedPoints = base + problemBonus + (p.streak > 1 ? streakBonus : 0);
  p.points += earnedPoints;
  p.totalReports += 1;
  if (hasPhoto) p.reportsWithPhoto += 1;
  
  // Check for new badge
  const currentBadgeIds = p.earnedBadgeIds || [];
  let newBadge: Badge | null = null;
  
  for (const badge of BADGES) {
    if (p.points >= badge.minPoints && !currentBadgeIds.includes(badge.id)) {
      currentBadgeIds.push(badge.id);
      newBadge = badge; // Assumes ordered, takes highest newly earned
    }
  }
  
  p.earnedBadgeIds = currentBadgeIds;
  saveProgress(p);
  
  return {
    newPoints: earnedPoints,
    earned: newBadge,
    progress: p
  };
};
