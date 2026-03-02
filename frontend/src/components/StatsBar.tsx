import { AlertCircle, Eye, Loader, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Stats } from '../types';

interface StatsBarProps {
    stats: Stats;
}

export function StatsBar({ stats }: StatsBarProps) {
    return (
        <div className="absolute bottom-4 right-[356px] flex items-center gap-2.5 z-10">
            <StatCard
                icon={<AlertCircle size={15} />}
                label="Yangi"
                value={stats.yangi}
                color="#ef4444"
                trend={{ value: 12, up: true }}
            />
            <StatCard
                icon={<Eye size={15} />}
                label="Ko'rilmoqda"
                value={stats["ko'rib_chiqilmoqda"]}
                color="#eab308"
                trend={{ value: 5, up: false }}
            />
            <StatCard
                icon={<Loader size={15} />}
                label="Jarayonda"
                value={stats.jarayonda}
                color="#3b82f6"
                trend={{ value: 8, up: true }}
            />
            <StatCard
                icon={<CheckCircle size={15} />}
                label="Hal etildi"
                value={stats.hal_etildi}
                color="#22c55e"
                trend={{ value: 15, up: true }}
            />
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
    trend,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    trend: { value: number; up: boolean };
}) {
    return (
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 min-w-[130px]">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5" style={{ color }}>
                    {icon}
                    <span className="text-[11px] font-medium text-slate-400">{label}</span>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-white tabular-nums">{value}</span>
                <span
                    className={`flex items-center gap-0.5 text-[11px] font-medium ${trend.up ? 'text-green-400' : 'text-red-400'
                        }`}
                >
                    {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend.value}%
                </span>
            </div>
        </div>
    );
}
