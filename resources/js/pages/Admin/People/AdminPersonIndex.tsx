import { IconArrowsSort } from '@/components/Icons/IconArrowsSort';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconSortAscending } from '@/components/Icons/IconSortAscending';
import { IconSortDescending } from '@/components/Icons/IconSortDescending';
import { IconTrash } from '@/components/Icons/IconTrash';
import Pagination from '@/components/Pagination';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginationResponse } from '@/types';
import { Person } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Button, Group, Paper, Stack, Table, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
    people: PaginationResponse<Person>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AdminPersonIndex({ people, sortBy, sortOrder }: Props) {
    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.people.index'), {
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
            <Head title="Manage People" />

            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>Manage People</Title>
                    <Button component={Link} href={route('admin.people.create')}>
                        Add Person
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
                            {people.data.map((person) => (
                                <Table.Tr key={person.id}>
                                    <Table.Td>{person.id}</Table.Td>
                                    <Table.Td>{person.name}</Table.Td>
                                    <Table.Td>{person.verdictsCount}</Table.Td>
                                    <Table.Td>{dayjs(person.createdAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                    <Table.Td>{dayjs(person.updatedAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon component={Link} href={route('admin.people.edit', person.id)} variant="light" color="blue">
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                component={Link}
                                                href={route('admin.people.destroy', person.id)}
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
                <Pagination paginationMeta={people.meta} paginationLinks={people.links} />
            </Stack>
        </AdminLayout>
    );
}
