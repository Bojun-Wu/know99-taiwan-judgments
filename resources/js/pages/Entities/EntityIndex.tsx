import { IconAlertCircle } from '@/components/Icons/IconAlertCircle';
import { IconBuilding } from '@/components/Icons/IconBuilding';
import IconChevronRight from '@/components/Icons/IconChevronRight';
import { IconDatabaseSearch } from '@/components/Icons/IconDatabaseSearch';
import { IconFileText } from '@/components/Icons/IconFileText';
import { IconSearch } from '@/components/Icons/IconSearch';
import { IconUser } from '@/components/Icons/IconUser';
import Pagination from '@/components/Pagination';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { PaginationMetaLinks } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Flex,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
    Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import classes from './EntityIndex.module.css';

interface Entity {
    id: number;
    name: string;
    type: 'person' | 'organization';
    verdicts_count: number;
    createdAt: string;
}

interface Props {
    entities: {
        current_page: number;
        data: Entity[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: PaginationMetaLinks[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    };
    query?: string;
}

export default function EntityIndex({ entities, query }: Props) {
    const isFirstPage = entities.current_page === 1;
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const number = new Intl.NumberFormat(locale);
    const pageTitle = isFirstPage ? t('entities.pageTitle') : `${t('common.page', { page: entities.current_page })} - ${t('entities.pageTitle')}`;
    const form = useForm({
        initialValues: {
            query: query || '',
        },
    });

    const handleSearch = form.onSubmit((values) => {
        router.get(localizedRoute('entities.index'), {
            ...(values.query && { query: values.query }),
        });
    });

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{pageTitle}</title>
                <meta name="description" content={t('entities.description')} />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={localizedRoute('entities.index')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${pageTitle} | ${t('siteName')}`} />
                <meta property="og:description" content={t('entities.ogDescription')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={localizedRoute('entities.index')} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                <link rel="alternate" hrefLang="zh-TW" href={localeRoute('entities.index', {}, 'zh-TW')} />
                <link rel="alternate" hrefLang="en" href={localeRoute('entities.index', {}, 'en')} />

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: t('entities.pageTitle'),
                        url: localizedRoute('entities.index'),
                        description: t('entities.structuredDescription'),
                        potentialAction: {
                            '@type': 'EntryPoint',
                            urlTemplate: `${localizedRoute('entities.index')}?query={search_term_string}`,
                        },
                        mainEntity: {
                            '@type': 'ItemList',
                            name: t('entities.pageTitle'),
                            numberOfItems: entities.total,
                            itemListElement: entities.data.map((entity, index) => ({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': entity.type === 'person' ? 'Person' : 'Organization',
                                    name: entity.name,
                                    url:
                                        entity.type === 'person'
                                            ? localizedRoute('people.show', entity.name)
                                            : localizedRoute('organizations.show', entity.name),
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
                    {/* 1. 頁面標題和介紹區域 */}
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Stack>
                            <Group gap="md">
                                <ThemeIcon variant="light" size={60} radius="md" visibleFrom="sm">
                                    <IconDatabaseSearch size={36} />
                                </ThemeIcon>
                                <Stack gap={5}>
                                    <Title order={1}>{t('entities.title')}</Title>
                                    <Text size="md" c="dimmed">
                                        {t('entities.intro')}
                                    </Text>
                                </Stack>
                            </Group>
                            <form onSubmit={handleSearch}>
                                <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                                    <TextInput
                                        placeholder={t('entities.placeholder')}
                                        leftSection={<IconSearch size={18} />}
                                        size="lg" // 調整大小
                                        flex={1}
                                        {...form.getInputProps('query')}
                                    />
                                    <Button type="submit" size="lg" leftSection={<IconSearch />}>
                                        {t('common.search')}
                                    </Button>
                                </Flex>
                            </form>
                        </Stack>
                    </Paper>

                    {/* 3. 結果總覽 */}
                    {query && entities.total > 0 && (
                        <Text size="sm" c="dimmed">
                            {t('entities.foundFor', { query, count: number.format(entities.total) })}
                        </Text>
                    )}
                    {!query && (
                        <Text size="sm" c="dimmed">
                            {t('entities.total', { count: number.format(entities.total) })}
                        </Text>
                    )}

                    {/* 4. 實體列表 */}
                    {entities.total > 0 ? (
                        <>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                                {entities.data.map((entity) => (
                                    <Card
                                        key={`${entity.type}-${entity.id}`}
                                        shadow="sm"
                                        padding="lg"
                                        radius="md"
                                        withBorder
                                        classNames={{ root: classes.card }}
                                        component={Link}
                                        href={
                                            entity.type === 'person'
                                                ? localizedRoute('people.show', entity.name)
                                                : localizedRoute('organizations.show', entity.name)
                                        }
                                    >
                                        <Stack gap="sm">
                                            <Group justify="space-between" align="flex-start">
                                                <Group gap="sm">
                                                    <ThemeIcon
                                                        variant="light"
                                                        color={entity.type === 'person' ? 'blue.6' : 'cyan.6'}
                                                        size="lg"
                                                        radius="md"
                                                    >
                                                        {entity.type === 'person' ? <IconUser size={20} /> : <IconBuilding size={20} />}
                                                    </ThemeIcon>
                                                    <Title order={4} size="md" fw={500} c={entity.type === 'person' ? 'blue.7' : 'cyan.7'}>
                                                        {entity.name}
                                                    </Title>
                                                </Group>
                                                <Badge variant="filled" size="sm" color={entity.type === 'person' ? 'deepBlue' : 'cyan'}>
                                                    {t(entity.type === 'person' ? 'common.person' : 'common.organization')}
                                                </Badge>
                                            </Group>
                                            <Divider />
                                            <Group justify="space-between" align="center">
                                                <Tooltip label={t('entities.mentionedTooltip', { count: number.format(entity.verdicts_count) })}>
                                                    <Badge variant="light" size="md" color="gray" leftSection={<IconFileText size={14} />}>
                                                        {t('entities.mentioned', { count: number.format(entity.verdicts_count) })}
                                                    </Badge>
                                                </Tooltip>
                                                <ThemeIcon variant="transparent" color="gray" size="lg">
                                                    <IconChevronRight size={20} />
                                                </ThemeIcon>
                                            </Group>
                                        </Stack>
                                    </Card>
                                ))}
                            </SimpleGrid>

                            <Center mt="md">
                                <Pagination
                                    paginationMeta={entities}
                                    paginationLinks={{
                                        first: entities.first_page_url,
                                        last: entities.last_page_url,
                                        next: entities.next_page_url,
                                        prev: entities.prev_page_url,
                                    }}
                                />
                            </Center>
                        </>
                    ) : (
                        <Paper p="xl" withBorder radius="md" ta="center">
                            <ThemeIcon variant="light" color="yellow" size={60} radius="xl" mb="md">
                                <IconAlertCircle size={36} />
                            </ThemeIcon>
                            <Title order={3} mb="xs">
                                {t('entities.noResults')}
                            </Title>
                            <Text c="dimmed">
                                {t('entities.noResultsDescription', { query: query || t('entities.yourSearch') })}
                                <br />
                                {t('entities.tryAgain')}
                            </Text>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
}
