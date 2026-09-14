import type { Config } from 'ziggy-js';
import { User } from './user';

interface Auth {
    user: ResourceResponse<User>;
}

interface SharedData {
    name: string;
    locale: 'zh-TW' | 'en';
    supportedLocales: Array<'zh-TW' | 'en'>;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    flash: {
        message: { title: string; message: string; color?: string }[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface PaginationMetaLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationMetaLinks[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface PaginationLinks {
    first: string;
    last: string;
    next: string;
    prev: string;
}

interface PaginationResponse<T> {
    data: T[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

interface ResourceResponse<T> {
    data: T;
}
