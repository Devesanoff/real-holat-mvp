import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MapArea } from './components/MapArea';
import { DetailPanel } from './components/DetailPanel';
import { StatsBar } from './components/StatsBar';
import { NewIssueModal } from './components/NewIssueModal';
import { fetchIssues, createIssue, voteForIssue } from './api';
import type { Issue, Stats, CreateIssuePayload } from './types';

// Generate a unique voter ID for this session
const VOTER_ID = `voter-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function computeStats(issues: Issue[]): Stats {
    const stats: Stats = {
        yangi: 0,
        "ko'rib_chiqilmoqda": 0,
        jarayonda: 0,
        hal_etildi: 0,
        total: issues.length,
    };
    for (const issue of issues) {
        switch (issue.status) {
            case 'yangi': stats.yangi++; break;
            case "ko'rib_chiqilmoqda": stats["ko'rib_chiqilmoqda"]++; break;
            case 'jarayonda': stats.jarayonda++; break;
            case 'hal_etildi': stats.hal_etildi++; break;
        }
    }
    return stats;
}

export default function App() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('barchasi');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Fetch issues on mount
    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const data = await fetchIssues();
            setIssues(data);
            if (data.length > 0 && !selectedId) {
                setSelectedId(data[0].id);
            }
        } catch (err) {
            console.error('Failed to load issues:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter issues
    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            const matchesSearch =
                searchQuery === '' ||
                issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.address.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                activeCategory === 'barchasi' || issue.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [issues, searchQuery, activeCategory]);

    // Selected issue
    const selectedIssue = useMemo(() => {
        return issues.find((i) => i.id === selectedId) || null;
    }, [issues, selectedId]);

    // Stats
    const stats = useMemo(() => computeStats(issues), [issues]);

    // Handle vote
    const handleVote = useCallback(async (issueId: string) => {
        try {
            const result = await voteForIssue(issueId, VOTER_ID);
            if (!result.error) {
                setIssues((prev) =>
                    prev.map((issue) =>
                        issue.id === issueId ? { ...issue, votes: result.votes } : issue
                    )
                );
                setVotedIds((prev) => new Set(prev).add(issueId));
            }
        } catch (err) {
            console.error('Vote failed:', err);
        }
    }, []);

    // Handle create issue
    const handleCreateIssue = useCallback(async (payload: CreateIssuePayload) => {
        try {
            const newIssue = await createIssue(payload);
            setIssues((prev) => [newIssue, ...prev]);
            setSelectedId(newIssue.id);
        } catch (err) {
            console.error('Failed to create issue:', err);
        }
    }, []);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-slate-400">Yuklanmoqda...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-[#0f172a]">
            {/* Top Navbar */}
            <Navbar stats={stats} onNewIssue={() => setIsModalOpen(true)} />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar */}
                <Sidebar
                    issues={filteredIssues}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {/* Center Map */}
                <MapArea
                    issues={issues}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />

                {/* Stats overlay on map */}
                <StatsBar stats={stats} />

                {/* Right Detail Panel */}
                <DetailPanel
                    issue={selectedIssue}
                    onVote={handleVote}
                    votedIds={votedIds}
                />
            </div>

            {/* New Issue Modal */}
            <NewIssueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateIssue}
            />
        </div>
    );
}
