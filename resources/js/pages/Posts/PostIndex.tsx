import { IconFileText } from '@/components/Icons/IconFileText';
import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard/PostCard';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Post } from '@/types/post';
import { Head } from '@inertiajs/react';
import { Alert, Container, Group, Stack, ThemeIcon, Title } from '@mantine/core';

interface Props {
    posts: PaginationResponse<Post>;
}

export default function PostIndex({ posts }: Props) {
    const isFirstPage = posts.meta.current_page === 1;
    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{isFirstPage ? '法律專欄文章 - 判決書解析、實用教學與近期趨勢' : `第 ${posts.meta.current_page} 頁 - 法律專欄文章`}</title>
                <meta
                    name="description"
                    content="瀏覽Know99判決書的法律專欄文章，涵蓋判決書深度解析、實用法律教學、近期司法趨勢分析以及社會熱門法律議題探討。獲取專業、易懂的法律知識。"
                />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={route('posts.index')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta
                    property="og:title"
                    content={isFirstPage ? '法律專欄文章 - 判決書解析、實用教學與近期趨勢' : `第 ${posts.meta.current_page} 頁 - 法律專欄文章`}
                />
                <meta
                    property="og:description"
                    content="瀏覽Know99判決書的法律專欄文章，涵蓋判決書深度解析、實用法律教學、近期司法趨勢分析以及社會熱門法律議題探討。獲取專業、易懂的法律知識。"
                />
                <meta property="og:type" content="blog" />
                <meta property="og:url" content={route('posts.index')} />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                {!isFirstPage && <link rel="alternate" hrefLang="zh-TW" href={route('posts.index')} />}

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        name: 'Know99法律專欄文章 - 判決書解析、實用教學與近期趨勢',
                        url: route('posts.index'),
                        description:
                            '瀏覽Know99判決書的法律專欄文章，涵蓋判決書深度解析、實用法律教學、近期司法趨勢分析以及社會熱門法律議題探討。獲取專業、易懂的法律知識。',
                        blogPost: posts.data.slice(0, 10).map((post) => ({
                            '@type': 'BlogPosting',
                            headline: post.title,
                            url: route('posts.show', post.slug),
                            datePublished: post.createdAt,
                            description: post.metaDescription,
                            author: {
                                '@type': 'Person',
                                name: post.author,
                            },
                            image: {
                                '@type': 'ImageObject',
                                url: post.thumbnailUrl,
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'Know99判決書',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://know99.com/favicon.ico',
                                    width: 16,
                                    height: 16,
                                },
                            },
                        })),
                    })}
                </script>
            </Head>
            <Container size="lg" py="md">
                <Stack gap="lg">
                    <Group align="center" gap="xs">
                        <ThemeIcon variant="light" size="lg" radius="md">
                            <IconFileText />
                        </ThemeIcon>
                        <Title order={2}>專欄文章</Title>
                    </Group>

                    {posts.data.length > 0 ? (
                        <>
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                            <Pagination paginationMeta={posts.meta} paginationLinks={posts.links} />
                        </>
                    ) : (
                        <Alert variant="light" color="deepBlue" title="無資料" icon={<IconInfoCircle size={24} />}>
                            目前尚無文章資料
                        </Alert>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
}
