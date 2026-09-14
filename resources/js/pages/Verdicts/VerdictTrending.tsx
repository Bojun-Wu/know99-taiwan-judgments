import { IconTrendingUp } from '@/components/Icons/IconTrendingUp';
import TrendingVerdictCard from '@/components/VerdictCard/TrendingVerdictCard';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { ResourceResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head } from '@inertiajs/react';
import { Container, Group, SimpleGrid, Stack, ThemeIcon, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
    verdicts: ResourceResponse<Verdict[]>;
}

export default function VerdictTrending({ verdicts }: Props) {
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{t('verdicts.trendingTitle')}</title>
                <meta name="description" content={t('verdicts.trendingDescription')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${t('verdicts.trendingTitle')} | ${t('siteName')}`} />
                <meta property="og:description" content={t('verdicts.trendingOgDescription')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={localizedRoute('verdicts.trending')} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('verdicts.trending', {}, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute('verdicts.trending', {}, 'en')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: t('verdicts.trendingTitle'),
                        url: localizedRoute('verdicts.trending'),
                        description: t('verdicts.trendingDescription'),
                        mainEntity: {
                            '@type': 'ItemList',
                            name: t('verdicts.trendingList'),
                            description: t('verdicts.trendingListDescription'),
                            itemListElement: verdicts.data.map((verdict, index) => {
                                const formalVerdictId = `${verdict.year} 年度${verdict.category}字第 ${verdict.number} 號`;
                                return {
                                    '@type': 'ListItem',
                                    position: index + 1,
                                    item: {
                                        '@type': 'LegalCase',
                                        name: `${verdict.court?.name} ${formalVerdictId} ${verdict.title}`,
                                        url: localizedRoute('verdicts.show', verdict.verdictId),
                                        description: verdict.content.replace(/\s/g, '').slice(0, 30) + '...',
                                    },
                                };
                            }),
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
                <Stack>
                    <Group align="center" gap="xs">
                        <ThemeIcon variant="light" size="lg" radius="md">
                            <IconTrendingUp />
                        </ThemeIcon>
                        <Title order={2}>{t('nav.trending')}</Title>
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
