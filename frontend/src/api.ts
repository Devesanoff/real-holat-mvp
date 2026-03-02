import type { Issue, CreateIssuePayload } from './types';

const BASE = '/api';

export async function fetchIssues(): Promise<Issue[]> {
    const res = await fetch(`${BASE}/issues`);
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
}

export async function createIssue(payload: CreateIssuePayload): Promise<Issue> {
    const res = await fetch(`${BASE}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create issue');
    return res.json();
}

export async function voteForIssue(issueId: string, voterId: string): Promise<{ votes: number; error?: string }> {
    const res = await fetch(`${BASE}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, voterId }),
    });
    return res.json();
}
