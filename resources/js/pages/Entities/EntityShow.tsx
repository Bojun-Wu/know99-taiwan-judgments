import { IconAlertCircle } from '@/components/Icons/IconAlertCircle';
import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconBuilding } from '@/components/Icons/IconBuilding';
import { IconUser } from '@/components/Icons/IconUser';
import Pagination from '@/components/Pagination';
import VerdictCard from '@/components/VerdictCard/VerdictCard';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head } from '@inertiajs/react';
import { Alert, Badge, Button, Center, Container, Group, Paper, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
    name: string;
    entityType: 'person' | 'organization';
    verdicts: PaginationResponse<Verdict> | null;
}

export default function EntityShow({ name, entityType, verdicts }: Props) {
    const isFirstPage = verdicts ? verdicts.meta.current_page === 1 : true;
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const number = new Intl.NumberFormat(locale);
    const routeName = entityType === 'person' ? 'people.show' : 'organizations.show';
    const url = localizedRoute(routeName, name);
    const count = number.format(verdicts?.meta.total || 0);
    const relatedTitle = t('entities.relatedTitle', { name });

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>
                    {isFirstPage
                        ? `${relatedTitle} | ${t('siteName')}`
                        : `${t('common.page', { page: verdicts?.meta.current_page })} - ${relatedTitle}`}
                </title>
                <meta name="description" content={t('entities.relatedDescription', { name, count })} />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={url} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${relatedTitle} | ${t('siteName')}`} />
                <meta property="og:description" content={t('entities.relatedDescription', { name, count })} />
                <meta property="og:type" content={entityType === 'person' ? 'profile' : 'object'} />
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute(routeName, name, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute(routeName, name, 'en')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': entityType === 'person' ? 'Person' : 'Organization',
                        name: name,
                        url: url,
                        description: t('entities.relatedDescription', { name, count }),
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': url,
                            hasPart: {
                                '@type': 'ItemList',
                                name: relatedTitle,
                                numberOfItems: verdicts?.meta.total || 0,
                                itemListElement: verdicts?.data.map((verdict, index) => ({
                                    '@type': 'ListItem',
                                    position: index + 1,
                                    item: {
                                        '@type': 'LegalCase',
                                        name: `${verdict.court?.name} ${verdict.year} 年度${verdict.category}字第 ${verdict.number} 號 ${verdict.title}`,
                                        url: localizedRoute('verdicts.show', verdict.verdictId),
                                        description: verdict.content.replace(/\s/g, '').slice(0, 30) + '...',
                                    },
                                })),
                            },
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: t('siteName'),
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
                            {t('common.previousPage')}
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
                                    {t('entities.mentionedIn', { count })}
                                </Badge>
                            </Group>
                        </Stack>
                    </Paper>

                    <Stack gap="md" mt="md">
                        <Title order={2} size="h4">
                            {t('entities.relatedVerdicts')}
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
                            <Alert icon={<IconAlertCircle size={16} />} title={t('entities.nothingFound')}>
                                {t('entities.useOtherKeyword')}
                            </Alert>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </Layout>
    );
}
