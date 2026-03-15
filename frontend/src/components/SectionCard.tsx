import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/helpers';

interface Props {
  title: string;
  Icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export default function SectionCard({ title, Icon, children, className, action }: Props) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-2xl overflow-hidden", className)}>
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h2 className="font-serif text-lg text-slate-900">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
