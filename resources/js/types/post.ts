export interface Post {
    id: number;
    title: string;
    slug: string;
    body: string;
    excerpt: string;
    status: 'draft' | 'published' | 'archived';
    metaDescription: string;
    createdAt: string;
    updatedAt: string;
    coverImageUrl: string;
    thumbnailUrl: string;
    author: string;

    viewsCount?: number;
}

export interface AdminPost {
    id: number;
    title: string;
    slug: string;
    body: string;
    excerpt: string | null;
    status: 'draft' | 'published' | 'archived';
    metaDescription: string | null;
    createdAt: string;
    updatedAt: string;
    coverImageUrl: string | null;
    thumbnailUrl: string | null;
    author: string | null;

    viewsCount?: number;
}
