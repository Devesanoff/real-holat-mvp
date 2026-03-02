import { MapPin, ThumbsUp, Clock } from 'lucide-react';
import type { Issue } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../types';

interface IssueCardProps {
    issue: Issue;
    isSelected: boolean;
    onClick: () => void;
}

export function IssueCard({ issue, isSelected, onClick }: IssueCardProps) {
    const statusColor = STATUS_COLORS[issue.status];
    const timeAgo = getTimeAgo(issue.createdAt);

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 group ${isSelected
                    ? 'bg-slate-700/60 border-blue-500/40'
                    : 'bg-slate-800/50 border-slate-700/40 hover:bg-slate-700/40 hover:border-slate-600/50'
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Status Indicator */}
                <div className="mt-1 shrink-0">
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: statusColor }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-slate-100 truncate leading-tight">
                        {issue.title}
                    </h3>

                    {/* Address */}
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                        <MapPin size={11} />
                        <span className="truncate">{issue.address}</span>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-3">
                            {/* Votes */}
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <ThumbsUp size={11} />
                                <span className="font-medium">{issue.votes}</span>
                            </span>
                            {/* Time */}
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={11} />
                                <span>{timeAgo}</span>
                            </span>
                        </div>

                        {/* Status badge */}
                        <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                                backgroundColor: statusColor + '18',
                                color: statusColor,
                            }}
                        >
                            {STATUS_LABELS[issue.status]}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}

function getTimeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'hozirgina';
    if (mins < 60) return `${mins} daq`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} soat`;
    const days = Math.floor(hrs / 24);
    return `${days} kun`;
}
