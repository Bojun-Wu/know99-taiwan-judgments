import { IconArchive } from '@/components/Icons/IconArchive';
import { IconArrowsSort } from '@/components/Icons/IconArrowsSort';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import { IconSortAscending } from '@/components/Icons/IconSortAscending';
import { IconSortDescending } from '@/components/Icons/IconSortDescending';
import Pagination from '@/components/Pagination';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginationResponse } from '@/types';
import { VerdictSummary } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Badge, Button, Group, HoverCard, Paper, Stack, Table, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
    summaries: PaginationResponse<VerdictSummary>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AdminVerdictSummaryIndex({ summaries, sortBy, sortOrder }: Props) {
    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.verdict-summaries.index'), {
            sort_by: column,
            sort_order: newSortOrder,
        });
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <IconArrowsSort size={16} />;
        }
        return sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />;
    };

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
        <Button onClick={() => handleSort(column)} variant="subtle" size="sm" rightSection={getSortIcon(column)} color="black">
            {children}
        </Button>
    );

    return (
        <AdminLayout>
            <Head title="Manage Verdict Summaries" />

            <Stack gap="lg">
                <Title order={2}>Manage Verdict Summaries</Title>
                <Paper shadow="xs" p="md">
                    <Table.ScrollContainer minWidth={1200}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>
                                        <SortableHeader column="id">ID</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="verdict_id">Verdict ID</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>Verdict Slug</Table.Th>
                                    <Table.Th>Chinese Summary</Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="upvotes_zh">Chinese Upvotes</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="downvotes_zh">Chinese Downvotes</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>English Summary</Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="upvotes_zh">English Upvotes</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="downvotes_zh">English Downvotes</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="status">Status</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="updated_at">Updated At</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="created_at">Created At</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {summaries.data.map((summary) => (
                                    <Table.Tr key={summary.id}>
                                        <Table.Td>{summary.id}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Text>{summary.verdictId}</Text>
                                                {summary.verdict && (
                                                    <ActionIcon.Group>
                                                        <ActionIcon
                                                            component={Link}
                                                            href={route('admin.verdicts.edit', summary.verdict.id)}
                                                            variant="default"
                                                        >
                                                            <IconEdit size={16} />
                                                        </ActionIcon>
                                                        <ActionIcon
                                                            component="a"
                                                            href={route('verdicts.show', summary.verdict.verdictId)}
                                                            target="_blank"
                                                            variant="default"
                                                        >
                                                            <IconExternalLink size={16} />
                                                        </ActionIcon>
                                                    </ActionIcon.Group>
                                                )}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" lineClamp={2}>
                                                {summary.verdict?.verdictId || '-'}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <HoverCard width={300} position="left">
                                                <HoverCard.Target>
                                                    <Text size="sm" lineClamp={2}>
                                                        {summary.summaryZh}
                                                    </Text>
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown>
                                                    <Text size="sm">{summary.summaryZh}</Text>
                                                </HoverCard.Dropdown>
                                            </HoverCard>
                                        </Table.Td>
                                        <Table.Td>{summary.upvotesZh}</Table.Td>
                                        <Table.Td>{summary.downvotesZh}</Table.Td>
                                        <Table.Td>
                                            <HoverCard width={300} position="left">
                                                <HoverCard.Target>
                                                    <Text size="sm" lineClamp={2}>
                                                        {summary.summaryEn}
                                                    </Text>
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown>
                                                    <Text size="sm">{summary.summaryEn}</Text>
                                                </HoverCard.Dropdown>
                                            </HoverCard>
                                        </Table.Td>
                                        <Table.Td>{summary.upvotesEn}</Table.Td>
                                        <Table.Td>{summary.downvotesEn}</Table.Td>
                                        <Table.Td>
                                            <Badge color={summary.status === 'active' ? 'green' : 'red'} size="sm">
                                                {summary.status === 'active' ? 'Active' : 'Deprecated'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>{dayjs(summary.updatedAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                        <Table.Td>{dayjs(summary.createdAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs" wrap="nowrap">
                                                <ActionIcon
                                                    component={Link}
                                                    href={route('admin.verdict-summaries.edit', summary.id)}
                                                    variant="light"
                                                    color="blue"
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                                {summary.status === 'active' && (
                                                    <ActionIcon
                                                        component={Link}
                                                        href={route('admin.verdict-summaries.deprecate', summary.id)}
                                                        method="delete"
                                                        as="button"
                                                        variant="light"
                                                        color="red"
                                                    >
                                                        <IconArchive size={16} />
                                                    </ActionIcon>
                                                )}
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Paper>
                <Pagination paginationMeta={summaries.meta} paginationLinks={summaries.links} />
            </Stack>
        </AdminLayout>
    );
}
