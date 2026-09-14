import { IconBooks } from '@/components/Icons/IconBooks';
import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import Pagination from '@/components/Pagination';
import VerdictCard from '@/components/VerdictCard/VerdictCard';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head } from '@inertiajs/react';
import { Alert, Container, Group, SimpleGrid, Stack, ThemeIcon, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
    verdicts: PaginationResponse<Verdict>;
}

export default function VerdictIndex({ verdicts }: Props) {
    const isFirstPage = verdicts.meta.current_page === 1;
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const pageTitle = isFirstPage ? t('verdicts.all') : `${t('common.page', { page: verdicts.meta.current_page })} - ${t('verdicts.all')}`;

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{pageTitle}</title>
                <meta name="description" content={t('verdicts.allDescription')} />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={localizedRoute('verdicts.index')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={t('verdicts.allDescription')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={localizedRoute('verdicts.index')} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('verdicts.index', {}, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute('verdicts.index', {}, 'en')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: t('verdicts.all'),
                        url: localizedRoute('verdicts.index'),
                        description: t('verdicts.allDescription'),
                        mainEntity: {
                            '@type': 'ItemList',
                            name: t('verdicts.all'),
                            numberOfItems: verdicts.meta.total,
                            itemListElement: verdicts.data.map((verdict, index) => ({
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
                    <Group align="center" gap="xs">
                        <ThemeIcon variant="light" size="lg" radius="md">
                            <IconBooks />
                        </ThemeIcon>
                        <Title order={2}>{t('verdicts.all')}</Title>
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
                        <Alert variant="light" color="deepBlue" title={t('common.noData')} icon={<IconInfoCircle size={24} />}>
                            {t('verdicts.none')}
                        </Alert>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
}
