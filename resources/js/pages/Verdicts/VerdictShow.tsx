import { IconArrowNarrowLeft } from '@/components/Icons/IconArrowNarrowLeft';
import { IconCheck } from '@/components/Icons/IconCheck';
import { IconCopy } from '@/components/Icons/IconCopy';
import { IconDownload } from '@/components/Icons/IconDownload';
import { IconLine } from '@/components/Icons/IconLine';
import AIAnalysisVerdictCard from '@/components/VerdictShow/AIAnalysisVerdictCard';
import TaggedContent from '@/components/VerdictShow/TaggedContent';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { ResourceResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { parseVerdictContent } from '@/utils/verdictParser';
import { Head, Link } from '@inertiajs/react';
import { ActionIcon, Anchor, Button, Container, CopyButton, Grid, Group, Stack, Text, Title, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './VerdictShow.module.css';

interface Props {
    verdict: ResourceResponse<Verdict>;
}

export default function VerdictShow({ verdict }: Props) {
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const parsedContent = useMemo(() => parseVerdictContent(verdict.data.content), [verdict.data.content]);
    const pdfDownloadUrl = `https://judgment.judicial.gov.tw/FILES/${verdict.data.verdictId.split('-')[0]}/${verdict.data.verdictId.split('-').slice(1).join(',')}.pdf`;
    // remove all whitespace and newlines(\r\n)
    const shortVerdictContent = verdict.data.content.replace(/\s/g, '').slice(0, 100);
    // 110 年度消債更字第 139 號
    const formalVerdictId = `${verdict.data.year} 年度${verdict.data.category}字第 ${verdict.data.number} 號`;
    const summary = verdict.data.summary;
    const summaryText = locale === 'en' ? summary?.summaryEn : summary?.summaryZh;
    const excerpt = summaryText ? t('verdicts.aiExcerpt', { summary: summaryText }) : t('verdicts.excerpt', { content: shortVerdictContent });
    const pageUrl = localizedRoute('verdicts.show', verdict.data.verdictId);

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{`${verdict.data.title} - ${formalVerdictId} - ${verdict.data.court?.name}`}</title>
                <meta
                    name="description"
                    content={t('verdicts.detailDescription', {
                        court: verdict.data.court?.name,
                        caseId: formalVerdictId,
                        title: verdict.data.title,
                        excerpt,
                        keywords: verdict.data.keywords ? t('verdicts.keywords', { keywords: verdict.data.keywords.join(', ') }) : '',
                    })}
                />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${verdict.data.title} - ${formalVerdictId} - ${verdict.data.court?.name} | ${t('siteName')}`} />
                <meta property="og:description" content={`${excerpt}${t('verdicts.viewFull')}`} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={`${dayjs(verdict.data.judgementDate).format('YYYY-MM-DDTHH:mm:ssZ')}`} />
                <meta property="article:section" content={verdict.data.type} />
                {verdict.data.keywords && verdict.data.keywords.map((keyword) => <meta property="article:tag" content={keyword} key={keyword} />)}
                <meta property="og:url" content={pageUrl} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="canonical" href={pageUrl} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('verdicts.show', verdict.data.verdictId, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute('verdicts.show', verdict.data.verdictId, 'en')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LegalCase',
                        name: t('verdicts.legalCaseName', { court: verdict.data.court?.name, caseId: formalVerdictId, title: verdict.data.title }),
                        identifier: verdict.data.verdictId,
                        url: pageUrl,
                        description: excerpt,
                        keywords: verdict.data.keywords?.join(', '),
                        inLanguage: locale,
                        datePublished: verdict.data.judgementDate,
                        legislationType: verdict.data.type,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': pageUrl,
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
                    <Group justify="space-between">
                        <Button variant="subtle" leftSection={<IconArrowNarrowLeft size={16} />} onClick={() => history.back()}>
                            {t('common.previousPage')}
                        </Button>
                        <Group>
                            <Tooltip label={t('common.shareLine')}>
                                <Anchor href={`https://social-plugins.line.me/lineit/share?url=${pageUrl}`}>
                                    <ActionIcon variant="outline" size="lg">
                                        <IconLine />
                                    </ActionIcon>
                                </Anchor>
                            </Tooltip>
                            <CopyButton value={pageUrl}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? t('common.linkCopied') : t('common.copyLink')}>
                                        <ActionIcon variant="outline" size="lg" color={copied ? 'teal' : 'deepBlue'} onClick={copy}>
                                            {copied ? <IconCheck /> : <IconCopy />}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                            <Tooltip label={t('verdicts.downloadPdf')}>
                                <Anchor href={pdfDownloadUrl} target="_blank">
                                    <ActionIcon variant="outline" size="lg">
                                        <IconDownload />
                                    </ActionIcon>
                                </Anchor>
                            </Tooltip>
                        </Group>
                    </Group>

                    <Stack px={{ base: 'md', xs: 'xl' }} py={{ base: 0, xs: 'xl' }} gap={0} classNames={{ root: classes.content }}>
                        <Stack mb="xl">
                            <Group align="flex-end">
                                <Title order={1}>{verdict.data.title}</Title>
                                <Group gap="sm">
                                    {verdict.data.keywords?.map((keyword, index) => (
                                        <Anchor
                                            component={Link}
                                            href={localizedRoute('verdicts.search', { query: keyword })}
                                            c="dimmed"
                                            size="sm"
                                            fs="italic"
                                            key={index}
                                            underline="hover"
                                        >
                                            # {keyword}
                                        </Anchor>
                                    ))}
                                </Group>
                            </Group>

                            <Grid gutter="lg">
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Text size="sm" c="dimmed">
                                        {t('verdicts.date')}
                                    </Text>
                                    <Text>{verdict.data.judgementDate}</Text>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Text size="sm" c="dimmed">
                                        {t('verdicts.caseNumber')}
                                    </Text>
                                    <Text>{verdict.data.verdictId}</Text>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Text size="sm" c="dimmed">
                                        {t('verdicts.category')}
                                    </Text>
                                    <Text>{verdict.data.category}</Text>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Text size="sm" c="dimmed">
                                        {t('verdicts.court')}
                                    </Text>
                                    <Text>{verdict.data.court?.name}</Text>
                                </Grid.Col>
                            </Grid>
                        </Stack>

                        <AIAnalysisVerdictCard verdict={verdict.data} />

                        <TaggedContent content={parsedContent} people={verdict.data.people} organizations={verdict.data.organizations} />
                    </Stack>
                </Stack>
            </Container>
        </Layout>
    );
}
