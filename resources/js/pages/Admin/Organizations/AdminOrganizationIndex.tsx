import { IconArrowsSort } from '@/components/Icons/IconArrowsSort';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconSortAscending } from '@/components/Icons/IconSortAscending';
import { IconSortDescending } from '@/components/Icons/IconSortDescending';
import { IconTrash } from '@/components/Icons/IconTrash';
import Pagination from '@/components/Pagination';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginationResponse } from '@/types';
import { Organization } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Button, Group, Paper, Stack, Table, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
    organizations: PaginationResponse<Organization>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AdminOrganizationIndex({ organizations, sortBy, sortOrder }: Props) {
    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.organizations.index'), {
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
            <Head title="Manage Organizations" />

            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>Manage Organizations</Title>
                    <Button component={Link} href={route('admin.organizations.create')}>
                        Add Organization
                    </Button>
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
                            {organizations.data.map((organization) => (
                                <Table.Tr key={organization.id}>
                                    <Table.Td>{organization.id}</Table.Td>
                                    <Table.Td>{organization.name}</Table.Td>
                                    <Table.Td>{organization.verdictsCount}</Table.Td>
                                    <Table.Td>{dayjs(organization.createdAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                    <Table.Td>{dayjs(organization.updatedAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon
                                                component={Link}
                                                href={route('admin.organizations.edit', organization.id)}
                                                variant="light"
                                                color="blue"
                                            >
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                component={Link}
                                                href={route('admin.organizations.destroy', organization.id)}
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
                </Paper>
                <Pagination paginationMeta={organizations.meta} paginationLinks={organizations.links} />
            </Stack>
        </AdminLayout>
    );
}
