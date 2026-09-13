import { IconArrowNarrowRight } from '@/components/Icons/IconArrowNarrowRight';
import { IconFileText } from '@/components/Icons/IconFileText';
import { IconSearch } from '@/components/Icons/IconSearch';
import { IconTag } from '@/components/Icons/IconTag';
import { IconTrendingUp } from '@/components/Icons/IconTrendingUp';
import PostCard from '@/components/PostCard/PostCard';
import TrendingVerdictCard from '@/components/VerdictCard/TrendingVerdictCard';
import Layout from '@/layouts/Layout';
import { PaginationResponse, ResourceResponse } from '@/types';
import { Post } from '@/types/post';
import { Verdict } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { Button, Container, Flex, Group, Paper, SimpleGrid, Stack, Text, TextInput, ThemeIcon, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
    verdicts: PaginationResponse<Verdict>;
    trendingKeywords: string[];
    trendingVerdicts: ResourceResponse<Verdict[]>;
    recentPosts: ResourceResponse<Post[]>;
}

export default function Index({ verdicts, trendingKeywords, trendingVerdicts, recentPosts }: Props) {
    const form = useForm({
        initialValues: {
            query: '',
        },
        validate: {
            query: (value) => (value.trim().length > 0 ? null : '請輸入搜尋關鍵字'),
        },
    });

    const handleSubmit = (values: { query: string }) => {
        router.get(route('verdicts.search'), values);
    };

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>判決書智慧查詢系統 - 快速查找公開判決書</title>
                <meta
                    name="description"
                    content="Know99判決書提供強大的判決書智慧查詢系統，幫助您快速查找、理解公開判決書，獲取判決案號、關鍵字、法官、案由等法律資訊。"
                />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content="判決書智慧查詢系統 - Know99判決書" />
                <meta property="og:description" content="快速查找、理解公開判決書，獲取您需要的法律資訊。探索熱門關鍵字和判決案例。" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://know99.com/" />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                <link rel="alternate" hrefLang="zh-TW" href="https://know99.com/" />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'Know99判決書',
                        url: 'https://know99.com/',
                        description: '提供公開判決書的智慧查詢、分析與瀏覽服務，幫助用戶快速獲取法律資訊。',
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: {
                                '@type': 'EntryPoint',
                                urlTemplate: 'https://know99.com/search?query={search_term_string}',
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
                                <Title order={1}>判決書智慧查詢系統</Title>
                                <Text c="dimmed">快速查找公開判決書，獲取您需要的法律資訊。</Text>
                            </Stack>
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                                    <TextInput placeholder="輸入案號、關鍵字、法官、案由等..." size="lg" flex={1} {...form.getInputProps('query')} />
                                    <Button type="submit" size="lg" leftSection={<IconSearch />}>
                                        搜尋判決
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
                            <Title order={3}>熱門關鍵字</Title>
                        </Group>
                        <Group gap="xs">
                            {trendingKeywords.map((keyword) => (
                                <Button
                                    key={keyword}
                                    component={Link}
                                    href={route('verdicts.search', { query: keyword })}
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
                                <Title order={3}>最新文章</Title>
                            </Group>
                            <Button
                                component={Link}
                                href={route('posts.index')}
                                variant="subtle"
                                size="sm"
                                rightSection={<IconArrowNarrowRight size={16} />}
                            >
                                查看更多
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
                                <Title order={3}>熱門判決書</Title>
                            </Group>
                            <Button
                                component={Link}
                                href={route('verdicts.trending')}
                                variant="subtle"
                                size="sm"
                                rightSection={<IconArrowNarrowRight size={16} />}
                            >
                                查看更多
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
