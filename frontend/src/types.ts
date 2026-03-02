export type IssueStatus = 'yangi' | "ko'rib_chiqilmoqda" | 'jarayonda' | 'hal_etildi';

export interface Issue {
    id: string;
    title: string;
    description: string;
    category: string;
    status: IssueStatus;
    lat: number;
    lng: number;
    votes: number;
    createdAt: string;
    address: string;
    author: string;
}

export interface Stats {
    yangi: number;
    "ko'rib_chiqilmoqda": number;
    jarayonda: number;
    hal_etildi: number;
    total: number;
}

export interface CreateIssuePayload {
    title: string;
    description: string;
    category: string;
    address: string;
    author: string;
    lat: number;
    lng: number;
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
    yangi: 'Yangi',
    "ko'rib_chiqilmoqda": "Ko'rib chiqilmoqda",
    jarayonda: 'Jarayonda',
    hal_etildi: 'Hal etildi',
};

export const STATUS_COLORS: Record<IssueStatus, string> = {
    yangi: '#ef4444',
    "ko'rib_chiqilmoqda": '#eab308',
    jarayonda: '#3b82f6',
    hal_etildi: '#22c55e',
};

export const CATEGORY_LABELS: Record<string, string> = {
    barchasi: 'Barchasi',
    yollar: "Yo'llar",
    tibbiyot: 'Tibbiyot',
    suv: 'Suv',
    gaz: 'Gaz',
    elektr: 'Elektr',
    boshqa: 'Boshqa',
};
