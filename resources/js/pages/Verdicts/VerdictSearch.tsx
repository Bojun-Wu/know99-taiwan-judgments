import { IconFilter } from '@/components/Icons/IconFilter';
import { IconFilterOff } from '@/components/Icons/IconFilterOff';
import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import { IconSearch } from '@/components/Icons/IconSearch';
import Pagination from '@/components/Pagination';
import VerdictCard from '@/components/VerdictCard/VerdictCard';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head, router } from '@inertiajs/react';
import { Alert, Badge, Button, Collapse, Container, Flex, Group, Paper, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

interface Props {
    query: {
        query: string;
        court: string | null;
        type: string | null;
        year: string | null;
        sortBy: string | null;
        page: number | null;
    };
    verdicts: PaginationResponse<Verdict>;
    aggregations: {
        // 可選的聚合數據，用於篩選器選項
        types: Array<{ type: string; count: number }>; // 案件類別
        courts: Array<{ court: string; count: number }>; // 法院
        years: Array<{ year: string; count: number }>; // 案號年度
    };
}

export default function VerdictSearch({ query, verdicts, aggregations }: Props) {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            query: query.query,
            court: query.court,
            type: query.type,
            year: query.year,
            sortBy: query.sortBy ?? 'desc',
        },
        validate: {
            query: (value) => (value.trim().length > 0 ? null : '請輸入搜尋關鍵字'),
        },
        onValuesChange: (values, previous) => {
            if (values.query !== previous.query) return;
            handleSubmit(values);
        },
    });

    let activeFilterCount = 0;
    Object.entries(form.getValues()).forEach(([key, value]) => {
        if ((key === 'court' || key === 'type' || key === 'year') && value) activeFilterCount++;
    });

    const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(activeFilterCount > 0);

    const handleSubmit = (values: typeof form.values) => {
        console.log('Submitting values:', values);
        router.get(route('verdicts.search'), {
            query: values.query,
            sort_by: values.sortBy,
            // filter no null params
            ...(values.court ? { court: values.court } : {}),
            ...(values.type ? { type: values.type } : {}),
            ...(values.year ? { year: values.year } : {}),
        });
    };

    // 有無篩選條件套用
    const isFilterApplied = !!query.court || !!query.type || !!query.year || !!query.sortBy || !!query.page;
    // 111年度、日期舊到新
    const filterDescription = [
        query.court ? `${query.court}` : '',
        query.type ? `${query.type}` : '',
        query.year ? `${query.year}年度` : '',
        query.sortBy ? `${query.sortBy === 'desc' ? '日期新到舊' : '日期舊到新'}` : '',
    ]
        .filter(Boolean)
        .join('、');
    // xxx - 第 2 頁
    const pageSuffix = query.page && query.page > 1 ? ` - 第 ${query.page} 頁` : '';

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{`「${query.query}」判決書搜尋結果${pageSuffix}`}</title>
                <meta
                    name="description"
                    content={`查找與「${query.query}」相關的判決書${pageSuffix}。${isFilterApplied ? `篩選條件：${filterDescription}。` : ''}Know99判決書提供判決查詢服務。`}
                />
                {/* 特定篩選組合不索引，避免重複內容 */}
                {isFilterApplied && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={route('verdicts.search', { query: query.query })} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`「${query.query}」判決書搜尋結果${pageSuffix} | Know99判決書`} />
                <meta property="og:description" content={`查看關於「${query.query}」的判決書搜尋結果，可進一步按法院、案件類型、年份篩選。`} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={route('verdicts.search', {
                        query: query.query,
                        court: query.court,
                        type: query.type,
                        year: query.year,
                        sortBy: query.sortBy,
                        page: query.page,
                    })}
                />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content="zh-TW" />
                {!isFilterApplied && <link rel="alternate" hrefLang="zh-TW" href={route('verdicts.search', { query: query.query })} />}

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: `「${query.query}」相關判決書搜尋結果 ${isFilterApplied ? `(${filterDescription})` : ''}`,
                        url: route('verdicts.search', {
                            query: query.query,
                            court: query.court,
                            type: query.type,
                            year: query.year,
                            sortBy: query.sortBy,
                            page: query.page,
                        }),
                        description: `查找與「${query.query}」相關的判決書。${isFilterApplied ? `篩選條件：${filterDescription}。` : ''}`,
                        mainEntity: {
                            '@type': 'ItemList',
                            name: '判決書列表',
                            numberOfItems: verdicts.meta.total,
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
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        <Stack gap="md">
                            <Title order={2}>搜尋結果：{query.query}</Title>
                            <Paper shadow="xs" p="md" radius="md" withBorder>
                                <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                                    <TextInput
                                        placeholder="輸入案號、關鍵字、法官、案由等..."
                                        size="md"
                                        flex={1}
                                        leftSection={<IconSearch />}
                                        {...form.getInputProps('query')}
                                    />
                                    <Button type="submit" size="md" leftSection={<IconSearch />}>
                                        搜尋
                                    </Button>
                                </Flex>
                            </Paper>
                        </Stack>

                        {/* 結果統計 與 篩選觸發器/排序 */}
                        {verdicts.meta.total > 0 ? (
                            <Stack gap="sm">
                                <Flex direction={{ base: 'column', xs: 'row' }} justify="space-between" gap="lg">
                                    <Text c="dimmed" size="sm">
                                        共找到 {verdicts.meta.total} 筆結果（第 {verdicts.meta.from}-{verdicts.meta.to} 筆）
                                    </Text>
                                    <Group justify="space-between" wrap="nowrap" gap="xs">
                                        <Select
                                            size="xs"
                                            placeholder="排序"
                                            data={[
                                                { value: 'desc', label: '日期新到舊' },
                                                { value: 'asc', label: '日期舊到新' },
                                            ]}
                                            allowDeselect={false}
                                            {...form.getInputProps('sortBy')}
                                        />
                                        <Group gap={5} wrap="nowrap">
                                            {activeFilterCount > 0 && (
                                                <Button
                                                    variant="light"
                                                    size="xs"
                                                    color="gray"
                                                    onClick={() => {
                                                        handleSubmit({
                                                            ...form.getValues(),
                                                            court: null,
                                                            type: null,
                                                            year: null,
                                                        });
                                                    }}
                                                >
                                                    清除
                                                </Button>
                                            )}
                                            <Button
                                                variant={filtersOpened || activeFilterCount > 0 ? 'light' : 'subtle'}
                                                size="xs"
                                                leftSection={filtersOpened ? <IconFilterOff /> : <IconFilter />}
                                                onClick={toggleFilters}
                                            >
                                                {filtersOpened ? '收起篩選' : '進階篩選'}
                                                {activeFilterCount > 0 && !filtersOpened && (
                                                    <Badge color="deepBlue" variant="filled" size="xs" circle ml={5}>
                                                        {activeFilterCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </Group>
                                    </Group>
                                </Flex>
                                <Collapse in={filtersOpened}>
                                    <Paper shadow="xs" p="md" radius="md" withBorder mt={activeFilterCount > 0 ? 0 : 'xs'}>
                                        <SimpleGrid cols={{ base: 1, xs: 3 }}>
                                            <Select
                                                label="法院"
                                                placeholder="選擇法院"
                                                data={Object.entries(aggregations.courts).map(([key, value]) => ({
                                                    value: key,
                                                    label: `${key} (${value})`,
                                                }))}
                                                clearable
                                                {...form.getInputProps('court')}
                                            />
                                            <Select
                                                label="案件類型"
                                                placeholder="選擇案件類型"
                                                data={Object.entries(aggregations.types).map(([key, value]) => ({
                                                    value: key,
                                                    label: `${key} (${value})`,
                                                }))}
                                                clearable
                                                {...form.getInputProps('type')}
                                            />
                                            <Select
                                                label="裁判年份"
                                                placeholder="選擇年份"
                                                data={Object.entries(aggregations.years).map(([key, value]) => ({
                                                    value: key,
                                                    label: `${key}年度 (${value})`,
                                                }))}
                                                clearable
                                                {...form.getInputProps('year')}
                                            />
                                        </SimpleGrid>
                                    </Paper>
                                </Collapse>
                                <Stack align="stretch" gap="md">
                                    {verdicts.data.map((verdict) => (
                                        <VerdictCard key={verdict.id} verdict={verdict} />
                                    ))}
                                    <Pagination paginationMeta={verdicts.meta} paginationLinks={verdicts.links} />
                                </Stack>
                            </Stack>
                        ) : (
                            <Alert variant="light" color="deepBlue" title="找不到符合的判決書" icon={<IconInfoCircle size={24} />}>
                                找不到符合條件的判決書
                            </Alert>
                        )}
                    </Stack>
                </form>
            </Container>
        </Layout>
    );
}
