import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { Head } from '@inertiajs/react';
import { Anchor, Box, Container, Group, Paper, Stack, Table, Text, ThemeIcon, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const DATA_RANGE_TABLE = [
    { type: '司法院刑事補償法庭', range: '85年起之案件' },
    { type: '司法院訴願決定書', range: '91年10月起之案件' },
    { type: '最高法院', range: '39年起之案件' },
    { type: '最高行政法院', range: '87年起之案件' },
    { type: '公務員懲戒委員會', range: '85年起之案件' },
    { type: '臺灣高等法院訴願決定書', range: '95年起之案件' },
    { type: '臺灣高等法院及其分院', range: '89年起之案件' },
    { type: '高等行政法院', range: '89年7月起之案件' },
    { type: '地方法院', range: '90年起之案件' },
    { type: '簡易庭', range: '90年起之案件' },
    { type: '地方法院執行權判決', range: '89年起之案件' },
];

const DATA_RANGE_TABLE_EN = [
    { type: 'Judicial Yuan Criminal Compensation Court', range: 'Cases since ROC Year 85 (1996)' },
    { type: 'Judicial Yuan administrative appeal decisions', range: 'Cases since ROC Year 91 (2002)' },
    { type: 'Supreme Court', range: 'Cases since ROC Year 39 (1950)' },
    { type: 'Supreme Administrative Court', range: 'Cases since ROC Year 87 (1998)' },
    { type: 'Commission on Disciplinary Sanctions of Functionaries', range: 'Cases since ROC Year 85 (1996)' },
    { type: 'Taiwan High Court administrative appeal decisions', range: 'Cases since ROC Year 95 (2006)' },
    { type: 'Taiwan High Court and its branches', range: 'Cases since ROC Year 89 (2000)' },
    { type: 'High Administrative Courts', range: 'Cases since ROC Year 89 (2000)' },
    { type: 'District Courts', range: 'Cases since ROC Year 90 (2001)' },
    { type: 'Summary Divisions', range: 'Cases since ROC Year 90 (2001)' },
    { type: 'District Court enforcement judgments', range: 'Cases since ROC Year 89 (2000)' },
];

export default function About() {
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const coverage = locale === 'en' ? DATA_RANGE_TABLE_EN : DATA_RANGE_TABLE;
    return (
        <Layout>
            <Head>
                <title>{t('about.pageTitle')}</title>
                <meta name="description" content={t('about.metaDescription')} />

                <meta name="robots" content="noindex, follow" />

                <meta property="og:title" content={t('about.pageTitle')} />
                <meta property="og:description" content={t('about.metaDescription')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={localizedRoute('about')} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                <meta http-equiv="Content-Language" content={locale} />
                <link rel="canonical" href={localizedRoute('about')} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('about', {}, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute('about', {}, 'en')} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: t('about.pageTitle'),
                        url: localizedRoute('about'),
                        description: t('about.metaDescription'),
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
                <Stack gap="3em">
                    <Paper radius="md" shadow="sm" p="xl" withBorder>
                        <Stack gap="xl">
                            <Group align="center" gap="xs">
                                <ThemeIcon variant="light" size={60} radius="md" visibleFrom="sm">
                                    <IconInfoCircle size={36} />
                                </ThemeIcon>
                                <Title order={1}>{t('about.title')}</Title>
                            </Group>
                            <Text c="dimmed" size="md">
                                {t('about.description')}
                            </Text>
                        </Stack>
                    </Paper>

                    <Paper radius="md" shadow="xs" p="xl" withBorder>
                        <Stack gap="md">
                            <Title order={3}>{t('about.dataSource')}</Title>
                            <Text>
                                {t('about.sourceBefore')}
                                <Anchor fw={500} href="https://opendata.judicial.gov.tw/" target="_blank">
                                    {t('about.sourceLink')}
                                </Anchor>
                                {t('about.sourceAfter')}
                            </Text>
                            <Text c="dimmed" size="sm" mt="xs">
                                <Anchor fw={500} href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0010053&flno=83" target="_blank">
                                    {t('about.lawLink')}
                                </Anchor>
                                {t('about.lawQuote')}
                            </Text>
                        </Stack>
                    </Paper>

                    <Paper radius="md" shadow="xs" p="xl" withBorder>
                        <Stack gap="md">
                            <Title order={3}>{t('about.coverage')}</Title>
                            <Stack gap="xs">
                                <Text mb="md">
                                    {t('about.coverageIntro')}
                                    <Anchor fw={500} href="https://judgment.judicial.gov.tw/readme.aspx" target="_blank">
                                        {t('about.coverageLink')}
                                    </Anchor>
                                    。
                                </Text>
                                <Text c="dimmed" size="sm">
                                    {t('about.betaNotice')}
                                </Text>
                            </Stack>
                            <Box px={{ md: 'xl' }}>
                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>{t('about.category')}</Table.Th>
                                            <Table.Th>{t('about.range')}</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {coverage.map((row) => (
                                            <Table.Tr key={row.type}>
                                                <Table.Td>{row.type}</Table.Td>
                                                <Table.Td>{row.range}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                        </Stack>
                    </Paper>
                    <Paper radius="md" shadow="xs" p="xl" withBorder>
                        <Stack gap="md">
                            <Title order={3}>{t('about.disclaimerTitle')}</Title>
                            <Text>{t('about.disclaimer')}</Text>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </Layout>
    );
}
