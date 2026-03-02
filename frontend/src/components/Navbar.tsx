import { Bell, MapPin, BarChart3, Users, Plus } from 'lucide-react';
import type { Stats } from '../types';

interface NavbarProps {
    stats: Stats;
    onNewIssue: () => void;
}

export function Navbar({ stats, onNewIssue }: NavbarProps) {
    return (
        <nav className="h-14 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4.5 h-4.5 text-white" size={18} />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-white">Real Holat</span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-700" />

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs">
                    <StatBadge
                        icon={<BarChart3 size={13} />}
                        label="Jami muammolar"
                        value={stats.total}
                    />
                    <StatBadge
                        icon={<Users size={13} />}
                        label="Hal etildi"
                        value={stats.hal_etildi}
                        color="text-green-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-700/50 transition-colors">
                    <Bell size={18} className="text-slate-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* CTA */}
                <button
                    onClick={onNewIssue}
                    className="flex items-center gap-2 px-4 h-9 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    <span>Muammo Xabar Qilish</span>
                </button>
            </div>
        </nav>
    );
}

function StatBadge({
    icon,
    label,
    value,
    color = 'text-slate-300',
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color?: string;
}) {
    return (
        <div className="flex items-center gap-1.5 text-slate-400">
            {icon}
            <span>{label}:</span>
            <span className={`font-semibold ${color}`}>{value}</span>
        </div>
    );
}
