import { cn, statusLabel } from '../utils/helpers';

interface StatusBadgeProps {
  status: 'good' | 'warning' | 'bad';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isSm = size === 'sm';
  
  const colors = {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    bad: 'bg-red-50 text-red-700 border-red-200',
  };

  const dotColors = {
    good: 'bg-emerald-500',
    warning: 'bg-amber-500',
    bad: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        isSm ? 'px-2 py-0.5 text-[10px] gap-1.5' : 'px-2.5 py-1 text-xs gap-2',
        colors[status]
      )}
    >
      <span className={cn('rounded-full', isSm ? 'w-1.5 h-1.5' : 'w-2 h-2', dotColors[status])} />
      {statusLabel(status)}
    </div>
  );
}
