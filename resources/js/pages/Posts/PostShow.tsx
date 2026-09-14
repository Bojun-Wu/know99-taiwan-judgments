import { IconArrowNarrowLeft } from '@/components/Icons/IconArrowNarrowLeft';
import { IconCalendar } from '@/components/Icons/IconCalendar';
import { IconCheck } from '@/components/Icons/IconCheck';
import { IconCopy } from '@/components/Icons/IconCopy';
import { IconLine } from '@/components/Icons/IconLine';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { ResourceResponse } from '@/types';
import { Post } from '@/types/post';
import { Head } from '@inertiajs/react';
import {
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    CopyButton,
    Group,
    Image,
    Stack,
    Text,
    Title,
    Tooltip,
    TypographyStylesProvider,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import classes from './PostShow.module.css';

const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'brown'];

interface Props {
    post: ResourceResponse<Post>;
}

export default function PostShow({ post }: Props) {
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const pageUrl = localizedRoute('posts.show', { post: post.data.slug });
    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{post.data.title}</title>
                <meta name="description" content={post.data.metaDescription} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${post.data.title} | ${t('siteName')}`} />
                <meta property="og:description" content={post.data.metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={`${dayjs(post.data.updatedAt).format('YYYY-MM-DDTHH:mm:ssZ')}`} />
                <meta property="article:author" content={post.data.author} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:image" content={post.data.coverImageUrl} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="canonical" href={pageUrl} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('posts.show', post.data.slug, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute('posts.show', post.data.slug, 'en')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': pageUrl,
                        },
                        headline: post.data.title,
                        image: [post.data.coverImageUrl, post.data.thumbnailUrl],
                        datePublished: post.data.updatedAt,
                        author: {
                            '@type': 'Person',
                            name: post.data.author,
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
                        description: post.data.metaDescription,
                        url: pageUrl,
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
                        </Group>
                    </Group>
                    <Stack gap="xl" px={{ base: 'md', xs: 'xl' }} py={{ base: 0, xs: 'xl' }} classNames={{ root: classes.content }}>
                        <Box>
                            <Image src={post.data.coverImageUrl} height={400} fit="contain" alt={post.data.title} radius="md" />
                        </Box>
                        <Stack gap="md">
                            <Group justify="space-between" align="center">
                                <Title order={1} size="h2">
                                    {post.data.title}
                                </Title>
                                {post.data.status !== 'published' && (
                                    <Badge color="gray" size="lg">
                                        {t('posts.unpublished')}
                                    </Badge>
                                )}
                            </Group>
                            <Group justify="space-between" align="flex-start">
                                <Group gap="xs">
                                    {/* random color */}
                                    <Avatar size={28} radius="xl" color={colors[Math.floor(Math.random() * colors.length)]}>
                                        {post.data.author.slice(0, 1).toUpperCase()}
                                    </Avatar>
                                    <Text size="sm" fw={500} c="dimmed">
                                        {post.data.author}
                                    </Text>
                                </Group>
                                <Group gap={5}>
                                    <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
                                    <Text size="sm" c="dimmed">
                                        {dayjs(post.data.createdAt).format('YYYY-MM-DD')}
                                    </Text>
                                </Group>
                            </Group>
                            <TypographyStylesProvider mt="xl">
                                <div dangerouslySetInnerHTML={{ __html: post.data.body }} />
                            </TypographyStylesProvider>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </Layout>
    );
}
