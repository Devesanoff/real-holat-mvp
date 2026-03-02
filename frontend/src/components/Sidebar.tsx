import { Search } from 'lucide-react';
import type { Issue } from '../types';
import { CATEGORY_LABELS } from '../types';
import { IssueCard } from './IssueCard';

interface SidebarProps {
    issues: Issue[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    activeCategory: string;
    onCategoryChange: (cat: string) => void;
}

export function Sidebar({
    issues,
    selectedId,
    onSelect,
    searchQuery,
    onSearchChange,
    activeCategory,
    onCategoryChange,
}: SidebarProps) {
    const categories = Object.entries(CATEGORY_LABELS);

    return (
        <aside className="w-[340px] shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
            {/* Search */}
            <div className="p-3.5">
                <div className="relative">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Muammolarni qidirish..."
                        className="w-full h-9 pl-9 pr-3 text-sm bg-slate-800/70 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="px-3.5 pb-3 flex flex-wrap gap-1.5">
                {categories.map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => onCategoryChange(key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeCategory === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/70 text-slate-400 hover:bg-slate-700/60 hover:text-slate-300 border border-slate-700/40'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800" />

            {/* Issue List */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {issues.length === 0 ? (
                    <div className="text-center text-slate-500 text-sm py-10">
                        Muammolar topilmadi
                    </div>
                ) : (
                    issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            isSelected={selectedId === issue.id}
                            onClick={() => onSelect(issue.id)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}
