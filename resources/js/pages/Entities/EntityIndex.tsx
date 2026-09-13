import { IconAlertCircle } from '@/components/Icons/IconAlertCircle';
import { IconBuilding } from '@/components/Icons/IconBuilding';
import IconChevronRight from '@/components/Icons/IconChevronRight';
import { IconDatabaseSearch } from '@/components/Icons/IconDatabaseSearch';
import { IconFileText } from '@/components/Icons/IconFileText';
import { IconSearch } from '@/components/Icons/IconSearch';
import { IconUser } from '@/components/Icons/IconUser';
import Pagination from '@/components/Pagination';
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
    const form = useForm({
        initialValues: {
            query: query || '',
        },
    });

    const handleSearch = form.onSubmit((values) => {
        router.get(route('entities.index'), {
            ...(values.query && { query: values.query }),
        });
    });

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{isFirstPage ? '判決書相關人名與組織機構資料庫' : `第 ${entities.current_page} 頁 - 判決書相關人名與組織機構資料庫`}</title>
                <meta
                    name="description"
                    content="探索Know99判決書的人名與組織機構資料庫。查找判決書中提及的特定人物、公司、法院及其他機構，並檢視相關案件數量與詳情。"
                />

                {/* 特定頁面不索引，避免重複內容 */}
                {!isFirstPage && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={route('entities.index')} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta
                    property="og:title"
                    content={`${isFirstPage ? '判決書相關人名與組織機構資料庫' : `第 ${entities.current_page} 頁 - 判決書相關人名與組織機構資料庫`} | Know99判決書`}
                />
                <meta property="og:description" content="查找判決書中提及的特定人物、公司、法院及其他機構，探索相關案件。" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={route('entities.index')} />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                {!isFirstPage && <link rel="alternate" hrefLang="zh-TW" href={route('entities.index')} />}

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: '判決書相關人名與組織機構資料庫',
                        url: route('entities.index'),
                        description: '瀏覽和搜尋判決書中提及的人名與組織機構。本資料庫列出了相關資料及其在判決書中的出現情況。',
                        potentialAction: {
                            '@type': 'EntryPoint',
                            urlTemplate: `${route('entities.index')}?query={search_term_string}`,
                        },
                        mainEntity: {
                            '@type': 'ItemList',
                            name: '判決書相關人名與組織機構資料庫',
                            numberOfItems: entities.total,
                            itemListElement: entities.data.map((entity, index) => ({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': entity.type === 'person' ? 'Person' : 'Organization',
                                    name: entity.name,
                                    url: entity.type === 'person' ? route('people.show', entity.name) : route('organizations.show', entity.name),
                                },
                            })),
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
                    {/* 1. 頁面標題和介紹區域 */}
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Stack>
                            <Group gap="md">
                                <ThemeIcon variant="light" size={60} radius="md" visibleFrom="sm">
                                    <IconDatabaseSearch size={36} />
                                </ThemeIcon>
                                <Stack gap={5}>
                                    <Title order={1}>人名與組織資料庫</Title>
                                    <Text size="md" c="dimmed">
                                        洞察判決書中的關鍵
                                        <Text span fw={700} c="blue.6">
                                            人物
                                        </Text>
                                        與
                                        <Text span fw={700} c="cyan.6">
                                            機構
                                        </Text>
                                        ， 發掘案件脈絡，掌握司法動態。
                                    </Text>
                                </Stack>
                            </Group>
                            <form onSubmit={handleSearch}>
                                <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                                    <TextInput
                                        placeholder="例如：王大明、XX股份有限公司..."
                                        leftSection={<IconSearch size={18} />}
                                        size="lg" // 調整大小
                                        flex={1}
                                        {...form.getInputProps('query')}
                                    />
                                    <Button type="submit" size="lg" leftSection={<IconSearch />}>
                                        搜尋
                                    </Button>
                                </Flex>
                            </form>
                        </Stack>
                    </Paper>

                    {/* 3. 結果總覽 */}
                    {query && entities.total > 0 && (
                        <Text size="sm" c="dimmed">
                            為您找到關於「{query}」的 {entities.total.toLocaleString()} 筆相關資料
                        </Text>
                    )}
                    {!query && (
                        <Text size="sm" c="dimmed">
                            總計 {entities.total.toLocaleString()} 筆人物與機構
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
                                        href={entity.type === 'person' ? route('people.show', entity.name) : route('organizations.show', entity.name)}
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
                                                    {entity.type === 'person' ? '人名' : '機構'}
                                                </Badge>
                                            </Group>
                                            <Divider />
                                            <Group justify="space-between" align="center">
                                                <Tooltip label={`在 ${entity.verdicts_count.toLocaleString()} 篇相關判決書中被提及`}>
                                                    <Badge variant="light" size="md" color="gray" leftSection={<IconFileText size={14} />}>
                                                        提及&nbsp;
                                                        <Text span fw={600}>
                                                            {entity.verdicts_count.toLocaleString()}
                                                        </Text>
                                                        &nbsp;篇判決
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
                                查無結果
                            </Title>
                            <Text c="dimmed">
                                抱歉，我們未能找到與「
                                <Text span fw={700}>
                                    {query || '您的搜尋詞'}
                                </Text>
                                」相關的資料。
                                <br />
                                請嘗試使用更廣泛的關鍵字，或檢查您的輸入是否有誤。
                            </Text>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
}
