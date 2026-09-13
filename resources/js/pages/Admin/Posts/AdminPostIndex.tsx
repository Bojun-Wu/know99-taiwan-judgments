import { IconArrowsSort } from '@/components/Icons/IconArrowsSort';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import { IconEye } from '@/components/Icons/IconEye';
import { IconSortAscending } from '@/components/Icons/IconSortAscending';
import { IconSortDescending } from '@/components/Icons/IconSortDescending';
import { IconTrash } from '@/components/Icons/IconTrash';
import Pagination from '@/components/Pagination';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginationResponse } from '@/types';
import { AdminPost } from '@/types/post';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Anchor, Badge, Button, Group, Image, Paper, Stack, Table, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
    posts: PaginationResponse<AdminPost>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AdminPostIndex({ posts, sortBy, sortOrder }: Props) {
    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.posts.index'), {
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

    const getStatusColor = (status: AdminPost['status']) => {
        switch (status) {
            case 'published':
                return 'green';
            case 'draft':
                return 'yellow';
            case 'archived':
                return 'gray';
            default:
                return 'blue';
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Posts" />
            <Stack gap="lg">
                <Group justify="space-between" mb="md">
                    <Title order={2}>Posts</Title>
                    <Button component={Link} href={route('admin.posts.create')}>
                        Create New Post
                    </Button>
                </Group>

                <Paper shadow="sm" p="md" withBorder>
                    <Table.ScrollContainer minWidth={1200}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>
                                        <SortableHeader column="id">ID</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>Thumbnail</Table.Th>
                                    <Table.Th>Cover</Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="title">Title</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="author">Author</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="status">Status</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>瀏覽次數</Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="created_at">Created</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>
                                        <SortableHeader column="updated_at">Updated</SortableHeader>
                                    </Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {posts.data.map((post) => (
                                    <Table.Tr key={post.id}>
                                        <Table.Td>{post.id}</Table.Td>
                                        <Table.Td>
                                            {post.thumbnailUrl ? (
                                                <Image src={post.thumbnailUrl} alt={post.title} h={50} w="auto" fit="contain" radius="sm" />
                                            ) : (
                                                <Text size="sm" c="dimmed">
                                                    無圖片
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            {post.coverImageUrl ? (
                                                <Image src={post.coverImageUrl} alt={post.title} h={50} w="auto" fit="contain" radius="sm" />
                                            ) : (
                                                <Text size="sm" c="dimmed">
                                                    無圖片
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <Stack gap="xs">
                                                <Group gap="xs">
                                                    <Text fw={500}>{post.title}</Text>
                                                    <Anchor href={route('posts.show', post.slug)} target="_blank">
                                                        <IconExternalLink size={16} />
                                                    </Anchor>
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    /{post.slug}
                                                </Text>
                                            </Stack>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{post.author || '無作者'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={getStatusColor(post.status)}>{post.status}</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap={4}>
                                                <IconEye size={16} />
                                                <Text>{post.viewsCount}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                        <Table.Td>{dayjs(post.updatedAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                        <Table.Td>
                                            <Group gap={4} wrap="nowrap">
                                                <ActionIcon component={Link} href={route('admin.posts.edit', post.id)} color="blue" variant="light">
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    color="red"
                                                    variant="light"
                                                    component={Link}
                                                    method="delete"
                                                    href={route('admin.posts.destroy', post.id)}
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
                <Pagination paginationMeta={posts.meta} paginationLinks={posts.links} />
            </Stack>
        </AdminLayout>
    );
}
