export interface Verdict {
    id: number;
    verdictId: string;
    year: number;
    category: string;
    number: string;
    title: string;
    content: string;
    judgementDate: string;
    type: string;
    keywords: string[] | null;
    updatedAt: Date;

    court?: Court;
    people?: Person[];
    organizations?: Organization[];
    summary?: VerdictSummary | null;
    summaries?: VerdictSummary[];
    viewsCount?: number;
    createdAt: string;
}

export interface Court {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;

    verdictsCount?: number;
    verdicts?: Verdict[];
}

export interface Person {
    id: number;
    name: string;
    role: string | null;
    createdAt: string;
    updatedAt: string;

    verdictsCount?: number;
    verdicts?: Verdict[];
}

export interface Organization {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;

    verdictsCount?: number;
    verdicts?: Verdict[];
}

export interface VerdictSummary {
    id: number;
    verdictId: string;
    summaryZh: string;
    summaryEn: string;
    upvotesZh: number;
    downvotesZh: number;
    upvotesEn: number;
    downvotesEn: number;
    status: 'active' | 'deprecated';
    createdAt: string;
    updatedAt: string;
    verdict?: Verdict;
}
