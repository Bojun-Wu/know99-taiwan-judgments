import { IconArrowsSort } from '@/components/Icons/IconArrowsSort';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import { IconSortAscending } from '@/components/Icons/IconSortAscending';
import { IconSortDescending } from '@/components/Icons/IconSortDescending';
import { IconTrash } from '@/components/Icons/IconTrash';
import Pagination from '@/components/Pagination';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginationResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Anchor, Badge, Button, Group, Paper, Stack, Table, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
    verdicts: PaginationResponse<Verdict>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AdminVerdictIndex({ verdicts, sortBy, sortOrder }: Props) {
    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.verdicts.index'), {
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
            <Head title="Manage Verdicts" />
            <Stack gap="lg">
                <Title order={2}>Manage Verdicts</Title>
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
                                    <Table.Th>觀看次數</Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="title">Title</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>Court</Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="judgement_date">Date</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="updated_at">Updated At</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {verdicts.data.map((verdict) => (
                                    <Table.Tr key={verdict.id}>
                                        <Table.Td>{verdict.id}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Text>{verdict.verdictId}</Text>
                                                <Badge size="sm" variant="light">
                                                    {verdict.type}
                                                </Badge>
                                                <Anchor href={route('verdicts.show', verdict.verdictId)} target="_blank">
                                                    <IconExternalLink size={16} />
                                                </Anchor>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>{verdict.viewsCount}</Table.Td>
                                        <Table.Td>{verdict.title}</Table.Td>
                                        <Table.Td>{verdict.court?.name || '-'}</Table.Td>
                                        <Table.Td>{verdict.judgementDate}</Table.Td>
                                        <Table.Td>{dayjs(verdict.updatedAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs" wrap="nowrap">
                                                <ActionIcon
                                                    component={Link}
                                                    href={route('admin.verdicts.edit', verdict.id)}
                                                    variant="light"
                                                    color="blue"
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    component={Link}
                                                    href={route('admin.verdicts.destroy', verdict.id)}
                                                    method="delete"
                                                    as="button"
                                                    variant="light"
                                                    color="red"
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Paper>
                <Pagination paginationMeta={verdicts.meta} paginationLinks={verdicts.links} />
            </Stack>
        </AdminLayout>
    );
}
