import { IconBooks } from '@/components/Icons/IconBooks';
import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import Pagination from '@/components/Pagination';
import VerdictCard from '@/components/VerdictCard/VerdictCard';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head } from '@inertiajs/react';
import { Alert, Container, Group, SimpleGrid, Stack, ThemeIcon, Title } from '@mantine/core';

interface Props {
    verdicts: PaginationResponse<Verdict>;
}

export default function VerdictIndex({ verdicts }: Props) {
    const isFirstPage = verdicts.meta.current_page === 1;

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{isFirstPage ? '所有判決書' : `第 ${verdicts.meta.current_page} 頁 - 所有判決書`}</title>
                <meta name="description" content="瀏覽所有公開判決書，快速查找您需要的法律資訊。" />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={route('verdicts.index')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={isFirstPage ? '所有判決書' : `第 ${verdicts.meta.current_page} 頁 - 所有判決書`} />
                <meta property="og:description" content="瀏覽所有公開判決書，快速查找您需要的法律資訊。" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={route('verdicts.index')} />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                <link rel="alternate" hrefLang="zh-TW" href={route('verdicts.index')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: '所有判決書',
                        url: route('verdicts.index'),
                        description: '瀏覽所有公開判決書，快速查找您需要的法律資訊。',
                        mainEntity: {
                            '@type': 'ItemList',
                            name: '所有判決書',
                            numberOfItems: verdicts.meta.total,
                            itemListElement: verdicts.data.map((verdict, index) => ({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': 'LegalCase',
                                    name: `${verdict.court?.name} ${verdict.year} 年度${verdict.category}字第 ${verdict.number} 號 ${verdict.title}`,
                                    url: route('verdicts.show', verdict.verdictId),
                                    description: verdict.content.replace(/\s/g, '').slice(0, 30) + '...',
                                },
                            })),
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
                    })}
                </script>
            </Head>

            <Container size="lg" py="md">
                <Stack gap="lg">
                    <Group align="center" gap="xs">
                        <ThemeIcon variant="light" size="lg" radius="md">
                            <IconBooks />
                        </ThemeIcon>
                        <Title order={2}>所有判決書</Title>
                    </Group>

                    {verdicts.data.length > 0 ? (
                        <>
                            <SimpleGrid cols={{ base: 1, md: 2 }}>
                                {verdicts.data.map((verdict) => (
                                    <VerdictCard key={verdict.id} verdict={verdict} />
                                ))}
                            </SimpleGrid>
                            <Pagination paginationMeta={verdicts.meta} paginationLinks={verdicts.links} />
                        </>
                    ) : (
                        <Alert variant="light" color="deepBlue" title="無資料" icon={<IconInfoCircle size={24} />}>
                            目前尚無判決書資料
                        </Alert>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
}
