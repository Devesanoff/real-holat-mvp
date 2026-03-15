import type { Task } from '../data/institutions';
import { cn, completionPct, doneTasksCount } from '../utils/helpers';
import { Check, AlertTriangle, X } from 'lucide-react';

interface Props {
  tasks: Task[];
}

export default function TaskChecklist({ tasks }: Props) {
  const pct = completionPct(tasks);
  const done = doneTasksCount(tasks);
  const total = tasks.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[12px] text-slate-500 font-medium">
          <span>{done}/{total} bajarilgan</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100">
        {tasks.map(task => {
          const isDone = task.status === 'done';
          const isWarn = task.status === 'warn';
          const isBad = task.status === 'bad';

          const bgBox = isDone ? 'bg-emerald-50 text-emerald-600' :
                        isWarn ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-600';

          const label = isDone ? 'Bajarilgan' :
                        isWarn ? 'Tekshirish kerak' :
                        'Muammo bor';

          const labelColors = isDone ? 'bg-emerald-50 text-emerald-700' :
                              isWarn ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700';

          return (
            <div key={task.id} className="py-3 flex items-center gap-3">
              <div className={cn("w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center", bgBox)}>
                {isDone && <Check className="w-4 h-4" />}
                {isWarn && <AlertTriangle className="w-4 h-4" />}
                {isBad && <X className="w-4 h-4" />}
              </div>
              
              <span className="text-sm font-medium text-slate-700 flex-1">
                {task.title}
              </span>

              <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap", labelColors)}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
