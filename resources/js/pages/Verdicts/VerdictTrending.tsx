import { IconTrendingUp } from '@/components/Icons/IconTrendingUp';
import TrendingVerdictCard from '@/components/VerdictCard/TrendingVerdictCard';
import Layout from '@/layouts/Layout';
import { ResourceResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head } from '@inertiajs/react';
import { Container, Group, SimpleGrid, Stack, ThemeIcon, Title } from '@mantine/core';

interface Props {
    verdicts: ResourceResponse<Verdict[]>;
}

export default function VerdictTrending({ verdicts }: Props) {
    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>熱門判決書 - 最新司法焦點與指標性案例</title>
                <meta
                    name="description"
                    content="探索 Know99判決書 精選的熱門判決書，涵蓋最新司法焦點、重要判例及指標性案件分析。即時了解大眾關心的法律議題。"
                />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content="熱門判決書 - 最新司法焦點與指標性案例 | Know99判決書" />
                <meta property="og:description" content="探索精選的熱門判決書，了解當前社會關注的法律議題和重要判例。" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={route('verdicts.trending')} />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                <link rel="alternate" hrefLang="zh-TW" href={route('verdicts.trending')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: '熱門判決書 - 最新司法焦點與指標性案例',
                        url: route('verdicts.trending'),
                        description: 'Know99判決書精選的當前最受關注的公開判決書列表，涵蓋多種類型案件。',
                        mainEntity: {
                            '@type': 'ItemList',
                            name: '熱門判決書列表',
                            description: '一系列當前受到高度關注的法院判決書。',
                            itemListElement: verdicts.data.map((verdict, index) => {
                                const formalVerdictId = `${verdict.year} 年度${verdict.category}字第 ${verdict.number} 號`;
                                return {
                                    '@type': 'ListItem',
                                    position: index + 1,
                                    item: {
                                        '@type': 'LegalCase',
                                        name: `${verdict.court?.name} ${formalVerdictId} ${verdict.title}`,
                                        url: route('verdicts.show', verdict.verdictId),
                                        description: verdict.content.replace(/\s/g, '').slice(0, 30) + '...',
                                    },
                                };
                            }),
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
                <Stack>
                    <Group align="center" gap="xs">
                        <ThemeIcon variant="light" size="lg" radius="md">
                            <IconTrendingUp />
                        </ThemeIcon>
                        <Title order={2}>熱門判決書</Title>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        {verdicts.data.map((verdict) => (
                            <TrendingVerdictCard key={verdict.id} verdict={verdict} />
                        ))}
                    </SimpleGrid>
                </Stack>
            </Container>
        </Layout>
    );
}
