import { IconArrowsSort } from '@/components/Icons/IconArrowsSort';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconSortAscending } from '@/components/Icons/IconSortAscending';
import { IconSortDescending } from '@/components/Icons/IconSortDescending';
import Pagination from '@/components/Pagination';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginationResponse } from '@/types';
import { Court } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Button, Group, Paper, Stack, Table, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
    courts: PaginationResponse<Court>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AdminCourtIndex({ courts, sortBy, sortOrder }: Props) {
    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.courts.index'), {
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
            <Head title="Manage Courts" />

            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>Manage Courts</Title>
                </Group>

                <Paper shadow="xs" p="md">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <SortableHeader column="id">ID</SortableHeader>
                                </Table.Th>
                                <Table.Th>
                                    <SortableHeader column="name">Name</SortableHeader>
                                </Table.Th>
                                <Table.Th>Related Verdicts</Table.Th>
                                <Table.Th>
                                    <SortableHeader column="created_at">Created At</SortableHeader>
                                </Table.Th>
                                <Table.Th>
                                    <SortableHeader column="updated_at">Updated At</SortableHeader>
                                </Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {courts.data.map((court) => (
                                <Table.Tr key={court.id}>
                                    <Table.Td>{court.id}</Table.Td>
                                    <Table.Td>{court.name}</Table.Td>
                                    <Table.Td>{court.verdictsCount}</Table.Td>
                                    <Table.Td>{dayjs(court.createdAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                    <Table.Td>{dayjs(court.updatedAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon component={Link} href={route('admin.courts.edit', court.id)} variant="light" color="blue">
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
                <Pagination paginationMeta={courts.meta} paginationLinks={courts.links} />
            </Stack>
        </AdminLayout>
    );
}
