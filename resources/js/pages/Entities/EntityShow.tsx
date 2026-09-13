import { IconAlertCircle } from '@/components/Icons/IconAlertCircle';
import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconBuilding } from '@/components/Icons/IconBuilding';
import { IconUser } from '@/components/Icons/IconUser';
import Pagination from '@/components/Pagination';
import VerdictCard from '@/components/VerdictCard/VerdictCard';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head } from '@inertiajs/react';
import { Alert, Badge, Button, Center, Container, Group, Paper, Stack, Title } from '@mantine/core';

interface Props {
    name: string;
    entityType: 'person' | 'organization';
    verdicts: PaginationResponse<Verdict> | null;
}

export default function EntityShow({ name, entityType, verdicts }: Props) {
    const isFirstPage = verdicts ? verdicts.meta.current_page === 1 : true;
    const url = entityType === 'person' ? route('people.show', name) : route('organizations.show', name);

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>
                    {isFirstPage
                        ? `與「${name}」相關的判決書列表 | Know99判決書`
                        : `第 ${verdicts?.meta.current_page} 頁 - 與「${name}」相關的判決書列表`}
                </title>
                <meta
                    name="description"
                    content={`查找所有提及「${name}」的公開判決書。Know99判決書為您整理了與「${name}」相關的案件列表，共在 ${verdicts?.meta.total.toLocaleString() || 0} 篇判決中提及。`}
                />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={url} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta
                    property="og:title"
                    content={`${isFirstPage ? `與「${name}」相關的判決書 - Know99判決書` : `第 ${verdicts?.meta.current_page} 頁 - 與「${name}」相關的判決書列表`} | Know99判決書`}
                />
                <meta
                    property="og:description"
                    content={`瀏覽提及「${name}」的所有判決書。目前共找到 ${verdicts?.meta.total.toLocaleString() || 0} 篇相關案件。`}
                />
                <meta property="og:type" content={entityType === 'person' ? 'profile' : 'object'} />
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                {!isFirstPage && <link rel="alternate" hrefLang="zh-TW" href={url} />}

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': entityType === 'person' ? 'Person' : 'Organization',
                        name: name,
                        url: url,
                        description: `「${name}」相關的判決書列表，共在 ${verdicts?.meta.total.toLocaleString() || 0} 篇判決中被提及。透過Know99判決書查看詳細案件內容。`,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': url,
                            hasPart: {
                                '@type': 'ItemList',
                                name: `與「${name}」相關的判決書列表`,
                                numberOfItems: verdicts?.meta.total || 0,
                                itemListElement: verdicts?.data.map((verdict, index) => ({
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
                    <Group>
                        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => history.back()}>
                            上一頁
                        </Button>
                    </Group>

                    <Paper withBorder p="lg" radius="md">
                        <Stack gap="md">
                            <Group gap="md" justify="space-between">
                                <Group gap="xs">
                                    {entityType === 'person' ? <IconUser size={32} /> : <IconBuilding size={32} />}
                                    <Title order={1} size="h2">
                                        {name}
                                    </Title>
                                </Group>
                                <Badge variant="outline" size="lg">
                                    在 {verdicts?.meta.total.toLocaleString() || 0} 篇判決書中提及
                                </Badge>
                            </Group>
                        </Stack>
                    </Paper>

                    <Stack gap="md" mt="md">
                        <Title order={2} size="h4">
                            相關判決書
                        </Title>

                        {verdicts && verdicts.data.length > 0 ? (
                            <>
                                <Stack gap="md">
                                    {verdicts.data.map((verdict: Verdict) => (
                                        <VerdictCard key={verdict.id} verdict={verdict} />
                                    ))}
                                    <Center>
                                        <Pagination paginationMeta={verdicts.meta} paginationLinks={verdicts.links} />
                                    </Center>
                                </Stack>
                            </>
                        ) : (
                            <Alert icon={<IconAlertCircle size={16} />} title="沒有找到任何資料">
                                請嘗試使用其他關鍵字搜尋。
                            </Alert>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </Layout>
    );
}
