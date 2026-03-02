import { ThumbsUp, MapPin, User, Clock, CheckCircle, AlertCircle, Loader, Eye } from 'lucide-react';
import type { Issue } from '../types';
import { STATUS_COLORS, STATUS_LABELS, CATEGORY_LABELS } from '../types';

interface DetailPanelProps {
    issue: Issue | null;
    onVote: (issueId: string) => void;
    votedIds: Set<string>;
}

export function DetailPanel({ issue, onVote, votedIds }: DetailPanelProps) {
    if (!issue) {
        return (
            <aside className="w-[340px] shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                    <MapPin size={24} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">
                    Tafsilotlarni ko'rish uchun muammoni tanlang
                </p>
            </aside>
        );
    }

    const statusColor = STATUS_COLORS[issue.status];
    const hasVoted = votedIds.has(issue.id);
    const timeAgo = getDetailTime(issue.createdAt);

    return (
        <aside className="w-[340px] shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-base font-semibold text-white leading-snug">
                        {issue.title}
                    </h2>
                    <span
                        className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: statusColor + '18', color: statusColor }}
                    >
                        {STATUS_LABELS[issue.status]}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <User size={12} />
                        {issue.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {timeAgo}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                {/* Description */}
                <div>
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                        Tavsif
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {issue.description}
                    </p>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3">
                    <MetaCard label="Kategoriya" value={CATEGORY_LABELS[issue.category] || issue.category} />
                    <MetaCard label="Manzil" value={issue.address} />
                    <MetaCard label="ID" value={issue.id} />
                    <MetaCard label="Ovozlar" value={String(issue.votes)} />
                </div>

                {/* Timeline */}
                <div>
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        Jarayon tarixi
                    </h3>
                    <div className="flex flex-col gap-0">
                        <TimelineEntry
                            icon={<AlertCircle size={14} />}
                            label="Muammo xabar qilindi"
                            time={timeAgo}
                            color="#ef4444"
                            isFirst
                        />
                        {(issue.status === "ko'rib_chiqilmoqda" || issue.status === 'jarayonda' || issue.status === 'hal_etildi') && (
                            <TimelineEntry
                                icon={<Eye size={14} />}
                                label="Ko'rib chiqilmoqda"
                                time="Yangilangan"
                                color="#eab308"
                            />
                        )}
                        {(issue.status === 'jarayonda' || issue.status === 'hal_etildi') && (
                            <TimelineEntry
                                icon={<Loader size={14} />}
                                label="Jarayonda"
                                time="Yangilangan"
                                color="#3b82f6"
                            />
                        )}
                        {issue.status === 'hal_etildi' && (
                            <TimelineEntry
                                icon={<CheckCircle size={14} />}
                                label="Hal etildi"
                                time="Yangilangan"
                                color="#22c55e"
                                isLast
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Vote Footer */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => onVote(issue.id)}
                    disabled={hasVoted}
                    className={`w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${hasVoted
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                >
                    <ThumbsUp size={15} />
                    {hasVoted ? 'Ovoz berildi' : `Ovoz berish (${issue.votes})`}
                </button>
            </div>
        </aside>
    );
}

function MetaCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/30">
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                {label}
            </div>
            <div className="text-xs text-slate-300 truncate">{value}</div>
        </div>
    );
}

function TimelineEntry({
    icon,
    label,
    time,
    color,
    isFirst = false,
    isLast = false,
}: {
    icon: React.ReactNode;
    label: string;
    time: string;
    color: string;
    isFirst?: boolean;
    isLast?: boolean;
}) {
    return (
        <div className="flex items-start gap-3 relative">
            {/* Vertical line */}
            {!isLast && (
                <div
                    className="absolute left-[11px] top-[22px] w-px h-[calc(100%+0px)] bg-slate-700/50"
                />
            )}
            {!isFirst && (
                <div
                    className="absolute left-[11px] top-0 w-px h-[6px] bg-slate-700/50"
                />
            )}

            <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: color + '20', color }}
            >
                {icon}
            </div>
            <div className="pb-4">
                <p className="text-sm text-slate-300">{label}</p>
                <p className="text-[11px] text-slate-500">{time}</p>
            </div>
        </div>
    );
}

function getDetailTime(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'hozirgina';
    if (mins < 60) return `${mins} daqiqa oldin`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} soat oldin`;
    const days = Math.floor(hrs / 24);
    return `${days} kun oldin`;
}
