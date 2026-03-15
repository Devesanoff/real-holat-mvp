import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  Icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-slate-200 rounded-2xl">
      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-slate-800 font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-slate-500 mt-2 max-w-sm text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
