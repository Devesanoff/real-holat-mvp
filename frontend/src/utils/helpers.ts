import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';
import clsx from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusLabel = (status: 'good' | 'warning' | 'bad' | 'done' | 'warn'): string => {
  switch (status) {
    case 'good': return 'Yaxshi holat';
    case 'warning': return 'Muammo bor'; // From user requirements
    case 'bad': return 'Muammo bor';
    case 'done': return 'Bajarilgan';
    case 'warn': return 'Tekshirish kerak';
    default: return '';
  }
};

export const taskLabel = statusLabel;

export const markerColor = (status: 'good' | 'warning' | 'bad') => {
  switch (status) {
    case 'good': return '#10B981';
    case 'warning': return '#F59E0B';
    case 'bad': return '#EF4444';
  }
};

export const timeAgo = (dateStr: string) => {
  // Provided dates in mock are already strings like "2 kun oldin", 
  // but if we need a standard timestamp formatter:
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return formatDistanceToNow(d, { addSuffix: true, locale: uz });
    }
  } catch (e) {}
  return dateStr;
};

export const completionPct = (tasks: {status: string}[]) => {
  if (!tasks || tasks.length === 0) return 0;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  return Math.round((doneCount / tasks.length) * 100);
};

export const doneTasksCount = (tasks: {status: string}[]) => {
  if (!tasks) return 0;
  return tasks.filter(t => t.status === 'done').length;
};
