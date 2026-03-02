import { useMemo } from 'react';
import type { Issue } from '../types';
import { STATUS_COLORS } from '../types';

interface MapAreaProps {
    issues: Issue[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function MapArea({ issues, selectedId, onSelect }: MapAreaProps) {
    // Map issue locations to pixel positions within the map area
    const dots = useMemo(() => {
        if (issues.length === 0) return [];

        // Tashkent approximate bounds
        const minLat = 41.2;
        const maxLat = 41.38;
        const minLng = 69.15;
        const maxLng = 69.35;

        return issues.map((issue) => {
            const x = ((issue.lng - minLng) / (maxLng - minLng)) * 100;
            const y = (1 - (issue.lat - minLat) / (maxLat - minLat)) * 100;
            return {
                id: issue.id,
                x: Math.max(5, Math.min(95, x)),
                y: Math.max(5, Math.min(95, y)),
                color: STATUS_COLORS[issue.status],
                title: issue.title,
                votes: issue.votes,
            };
        });
    }, [issues]);

    return (
        <div className="flex-1 relative overflow-hidden bg-[#0c1222]">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Ambient Glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            {/* City Label */}
            <div className="absolute top-5 left-5 flex items-center gap-2 text-slate-500/70">
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
                <span className="text-xs font-medium tracking-wide uppercase">Toshkent shahri</span>
            </div>

            {/* Issue Dots */}
            {dots.map((dot) => {
                const isActive = selectedId === dot.id;
                return (
                    <button
                        key={dot.id}
                        onClick={() => onSelect(dot.id)}
                        className="absolute group"
                        style={{
                            left: `${dot.x}%`,
                            top: `${dot.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {/* Outer glow ring */}
                        <div
                            className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive ? 'scale-[3] opacity-20' : 'scale-[2] opacity-0 group-hover:opacity-10'
                                }`}
                            style={{ backgroundColor: dot.color, width: 12, height: 12, margin: '-3px' }}
                        />

                        {/* Core dot */}
                        <div
                            className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${isActive ? 'scale-150' : 'dot-glow group-hover:scale-125'
                                }`}
                            style={{
                                backgroundColor: dot.color,
                                borderColor: isActive ? '#fff' : dot.color,
                                boxShadow: `0 0 ${isActive ? 12 : 6}px ${dot.color}60`,
                            }}
                        />

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                            {dot.title}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-700" />
                        </div>
                    </button>
                );
            })}

            {/* Legend */}
            <div className="absolute bottom-5 left-5 flex items-center gap-4 text-[11px] text-slate-500">
                <LegendItem color="#ef4444" label="Yangi" />
                <LegendItem color="#eab308" label="Ko'rilmoqda" />
                <LegendItem color="#3b82f6" label="Jarayonda" />
                <LegendItem color="#22c55e" label="Hal etildi" />
            </div>
        </div>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span>{label}</span>
        </div>
    );
}
