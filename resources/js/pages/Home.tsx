import { IconArrowNarrowRight } from '@/components/Icons/IconArrowNarrowRight';
import { IconFileText } from '@/components/Icons/IconFileText';
import { IconSearch } from '@/components/Icons/IconSearch';
import { IconTag } from '@/components/Icons/IconTag';
import { IconTrendingUp } from '@/components/Icons/IconTrendingUp';
import PostCard from '@/components/PostCard/PostCard';
import TrendingVerdictCard from '@/components/VerdictCard/TrendingVerdictCard';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { ResourceResponse } from '@/types';
import { Post } from '@/types/post';
import { Verdict } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { Button, Container, Flex, Group, Paper, SimpleGrid, Stack, Text, TextInput, ThemeIcon, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

interface Props {
    trendingKeywords: string[];
    trendingVerdicts: ResourceResponse<Verdict[]>;
    recentPosts: ResourceResponse<Post[]>;
}

export default function Index({ trendingKeywords, trendingVerdicts, recentPosts }: Props) {
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const form = useForm({
        initialValues: {
            query: '',
        },
        validate: {
            query: (value) => (value.trim().length > 0 ? null : t('common.searchRequired')),
        },
    });

    const handleSubmit = (values: { query: string }) => {
        router.get(localizedRoute('verdicts.search'), values);
    };

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{t('home.pageTitle')}</title>
                <meta name="description" content={t('home.metaDescription')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${t('home.title')} - ${t('siteName')}`} />
                <meta property="og:description" content={t('home.ogDescription')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={localizedRoute('home', {}, true)} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="canonical" href={localizedRoute('home', {}, true)} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('home', {}, 'zh-TW', true)} />
                <link rel="alternate" hrefLang="en" href={localeRoute('home', {}, 'en', true)} />
                <link rel="alternate" hrefLang="x-default" href={localeRoute('home', {}, 'zh-TW', true)} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: t('siteName'),
                        url: localizedRoute('home', {}, true),
                        description: t('home.structuredDescription'),
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: {
                                '@type': 'EntryPoint',
                                urlTemplate: `${localizedRoute('verdicts.search', {}, true)}?query={search_term_string}`,
                            },
                            'query-input': 'required name=search_term_string',
                        },
                    })}
                </script>
            </Head>

            <Container size="lg" py="md">
                <Stack gap="3em">
                    <Paper radius="md" shadow="sm" p="xl" withBorder>
                        <Stack gap="xl">
                            <Stack gap="md">
                                <Title order={1}>{t('home.title')}</Title>
                                <Text c="dimmed">{t('home.description')}</Text>
                            </Stack>
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                                    <TextInput placeholder={t('common.searchPlaceholder')} size="lg" flex={1} {...form.getInputProps('query')} />
                                    <Button type="submit" size="lg" leftSection={<IconSearch />}>
                                        {t('common.searchVerdicts')}
                                    </Button>
                                </Flex>
                            </form>
                        </Stack>
                    </Paper>

                    {/* 2. 熱門關鍵字 */}
                    <Stack gap="md">
                        <Group align="center" gap="xs">
                            <ThemeIcon variant="light" size="lg" radius="md">
                                <IconTag />
                            </ThemeIcon>
                            <Title order={3}>{t('home.trendingKeywords')}</Title>
                        </Group>
                        <Group gap="xs">
                            {trendingKeywords.map((keyword) => (
                                <Button
                                    key={keyword}
                                    component={Link}
                                    href={localizedRoute('verdicts.search', { query: keyword })}
                                    variant="light"
                                    size="sm"
                                    radius="xl"
                                    rightSection={<IconSearch size={16} />}
                                >
                                    {keyword}
                                </Button>
                            ))}
                        </Group>
                    </Stack>

                    {/* 3. 最近文章 */}
                    <Stack gap="md">
                        <Group justify="space-between" align="flex-end">
                            <Group align="center" gap="xs">
                                <ThemeIcon variant="light" size="lg" radius="md">
                                    <IconFileText />
                                </ThemeIcon>
                                <Title order={3}>{t('home.recentPosts')}</Title>
                            </Group>
                            <Button
                                component={Link}
                                href={localizedRoute('posts.index')}
                                variant="subtle"
                                size="sm"
                                rightSection={<IconArrowNarrowRight size={16} />}
                            >
                                {t('common.viewMore')}
                            </Button>
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            {recentPosts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </SimpleGrid>
                    </Stack>

                    {/* 4. 熱門判決書 */}
                    <Stack gap="md">
                        <Group justify="space-between" align="flex-end">
                            <Group align="center" gap="xs">
                                <ThemeIcon variant="light" size="lg" radius="md">
                                    <IconTrendingUp />
                                </ThemeIcon>
                                <Title order={3}>{t('home.trendingVerdicts')}</Title>
                            </Group>
                            <Button
                                component={Link}
                                href={localizedRoute('verdicts.trending')}
                                variant="subtle"
                                size="sm"
                                rightSection={<IconArrowNarrowRight size={16} />}
                            >
                                {t('common.viewMore')}
                            </Button>
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            {trendingVerdicts.data.map((verdict) => (
                                <TrendingVerdictCard key={verdict.id} verdict={verdict} />
                            ))}
                        </SimpleGrid>
                    </Stack>
                </Stack>
            </Container>
        </Layout>
    );
}
