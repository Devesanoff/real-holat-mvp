import type { Report } from '../data/institutions';
import { timeAgo } from '../utils/helpers';
import StatusBadge from './StatusBadge';

interface Props {
  report: Report;
}

export default function ReportCard({ report }: Props) {
  return (
    <div className="py-3.5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold uppercase shrink-0">
            {report.userInitials}
          </div>
          <span className="text-sm font-semibold text-slate-800">{report.userName}</span>
        </div>
        
        <StatusBadge status={report.status} size="sm" />
      </div>

      <p className="text-[13px] text-slate-600 leading-relaxed mt-1">
        {report.comment}
      </p>

      <div className="text-[11px] text-slate-400 font-medium">
        {timeAgo(report.date)}
      </div>
    </div>
  );
}
