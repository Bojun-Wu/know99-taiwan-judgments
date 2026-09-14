import { IconFilter } from '@/components/Icons/IconFilter';
import { IconFilterOff } from '@/components/Icons/IconFilterOff';
import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import { IconSearch } from '@/components/Icons/IconSearch';
import Pagination from '@/components/Pagination';
import VerdictCard from '@/components/VerdictCard/VerdictCard';
import { localeRoute, useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head, router } from '@inertiajs/react';
import { Alert, Badge, Button, Collapse, Container, Flex, Group, Paper, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

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
    const { t, i18n } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const locale = i18n.language === 'en' ? 'en' : 'zh-TW';
    const number = new Intl.NumberFormat(locale);
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
            query: (value) => (value.trim().length > 0 ? null : t('common.searchRequired')),
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
        router.get(localizedRoute('verdicts.search'), {
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
        query.type ? t(`caseTypes.${query.type}`, { defaultValue: query.type }) : '',
        query.year ? (locale === 'en' ? `${query.year}` : `${query.year}年度`) : '',
        query.sortBy ? t(query.sortBy === 'desc' ? 'search.newest' : 'search.oldest') : '',
    ]
        .filter(Boolean)
        .join('、');
    // xxx - 第 2 頁
    const pageSuffix = query.page && query.page > 1 ? ` - ${t('common.page', { page: query.page })}` : '';
    const filterMeta = isFilterApplied ? t('search.filtersDescription', { filters: filterDescription }) : '';
    const routeParams = {
        query: query.query,
        court: query.court,
        type: query.type,
        year: query.year,
        sort_by: query.sortBy,
        page: query.page,
    };

    return (
        <Layout>
            <Head>
                {/* 基本 SEO 標籤 */}
                <title>{t('search.pageTitle', { query: query.query, pageSuffix })}</title>
                <meta name="description" content={t('search.description', { query: query.query, pageSuffix, filters: filterMeta })} />
                {/* 特定篩選組合不索引，避免重複內容 */}
                {isFilterApplied && <meta name="robots" content="noindex, follow" />}
                <link rel="canonical" href={localizedRoute('verdicts.search', { query: query.query })} />

                {/* Open Graph (OG) 標籤 - 用於社群媒體分享 */}
                <meta property="og:title" content={`${t('search.pageTitle', { query: query.query, pageSuffix })} | ${t('siteName')}`} />
                <meta property="og:description" content={t('search.ogDescription', { query: query.query })} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={localizedRoute('verdicts.search', routeParams)} />
                <meta property="og:site_name" content={t('siteName')} />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_TW'} />

                {/* 語言聲明 */}
                <meta http-equiv="Content-Language" content={locale} />
                {!isFilterApplied && <link rel="alternate" hrefLang="zh-TW" href={localeRoute('verdicts.search', { query: query.query }, 'zh-TW')} />}
                {!isFilterApplied && <link rel="alternate" hrefLang="en" href={localeRoute('verdicts.search', { query: query.query }, 'en')} />}

                {/* 結構化數據 (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: t('search.pageTitle', { query: query.query, pageSuffix }),
                        url: localizedRoute('verdicts.search', routeParams),
                        description: t('search.description', { query: query.query, pageSuffix, filters: filterMeta }),
                        mainEntity: {
                            '@type': 'ItemList',
                            name: t('search.verdictList'),
                            numberOfItems: verdicts.meta.total,
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
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        <Stack gap="md">
                            <Title order={2}>{t('search.title', { query: query.query })}</Title>
                            <Paper shadow="xs" p="md" radius="md" withBorder>
                                <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                                    <TextInput
                                        placeholder={t('common.searchPlaceholder')}
                                        size="md"
                                        flex={1}
                                        leftSection={<IconSearch />}
                                        {...form.getInputProps('query')}
                                    />
                                    <Button type="submit" size="md" leftSection={<IconSearch />}>
                                        {t('common.search')}
                                    </Button>
                                </Flex>
                            </Paper>
                        </Stack>

                        {/* 結果統計 與 篩選觸發器/排序 */}
                        {verdicts.meta.total > 0 ? (
                            <Stack gap="sm">
                                <Flex direction={{ base: 'column', xs: 'row' }} justify="space-between" gap="lg">
                                    <Text c="dimmed" size="sm">
                                        {t('search.resultCount', {
                                            total: number.format(verdicts.meta.total),
                                            from: number.format(verdicts.meta.from),
                                            to: number.format(verdicts.meta.to),
                                        })}
                                    </Text>
                                    <Group justify="space-between" wrap="nowrap" gap="xs">
                                        <Select
                                            size="xs"
                                            placeholder={t('search.sort')}
                                            data={[
                                                { value: 'desc', label: t('search.newest') },
                                                { value: 'asc', label: t('search.oldest') },
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
                                                    {t('search.clear')}
                                                </Button>
                                            )}
                                            <Button
                                                variant={filtersOpened || activeFilterCount > 0 ? 'light' : 'subtle'}
                                                size="xs"
                                                leftSection={filtersOpened ? <IconFilterOff /> : <IconFilter />}
                                                onClick={toggleFilters}
                                            >
                                                {t(filtersOpened ? 'search.hideFilters' : 'search.showFilters')}
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
                                                label={t('search.court')}
                                                placeholder={t('search.selectCourt')}
                                                data={Object.entries(aggregations.courts).map(([key, value]) => ({
                                                    value: key,
                                                    label: `${key} (${value})`,
                                                }))}
                                                clearable
                                                {...form.getInputProps('court')}
                                            />
                                            <Select
                                                label={t('search.caseType')}
                                                placeholder={t('search.selectCaseType')}
                                                data={Object.entries(aggregations.types).map(([key, value]) => ({
                                                    value: key,
                                                    label: `${t(`caseTypes.${key}`, { defaultValue: key })} (${value})`,
                                                }))}
                                                clearable
                                                {...form.getInputProps('type')}
                                            />
                                            <Select
                                                label={t('search.year')}
                                                placeholder={t('search.selectYear')}
                                                data={Object.entries(aggregations.years).map(([key, value]) => ({
                                                    value: key,
                                                    label: t('search.yearOption', { year: key, count: value }),
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
                            <Alert variant="light" color="deepBlue" title={t('search.noResultsTitle')} icon={<IconInfoCircle size={24} />}>
                                {t('search.noResults')}
                            </Alert>
                        )}
                    </Stack>
                </form>
            </Container>
        </Layout>
    );
}
