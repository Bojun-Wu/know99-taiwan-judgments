import { useLocalizedRoute } from '@/i18n/routes';
import { Post } from '@/types/post';
import { Link } from '@inertiajs/react';
import { Avatar, Card, Group, Image, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { IconCalendar } from '../Icons/IconCalendar';
import { IconEye } from '../Icons/IconEye';
import classes from './PostCard.module.css';

const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'brown'];

export default function PostCard({ post }: { post: Post }) {
    const localizedRoute = useLocalizedRoute();
    return (
        <Card
            withBorder
            radius="md"
            shadow="sm"
            component={Link}
            href={localizedRoute('posts.show', { post: post.slug })}
            classNames={{ root: classes.card }}
        >
            <Stack h="100%" justify="space-between">
                <Group align="flex-start" justify="space-between" wrap="nowrap">
                    <Stack gap="xs">
                        <Group gap="xs" align="center">
                            {/* random color */}
                            <Avatar size={28} radius="xl" color={colors[Math.floor(Math.random() * colors.length)]}>
                                {post.author.slice(0, 1).toUpperCase()}
                            </Avatar>
                            <Text size="sm" fw={500} c="dimmed">
                                {post.author}
                            </Text>
                        </Group>
                        <Title order={3} size="lg" lineClamp={2} c="var(--mantine-color-text)">
                            {post.title}
                        </Title>
                        <Text size="md" c="dimmed" lineClamp={2}>
                            {post.excerpt}
                        </Text>
                    </Stack>
                    <Image src={post.thumbnailUrl} h={{ base: 70, sm: 100 }} w={{ base: 70, sm: 100 }} fit="contain" alt={post.title} radius="md" />
                </Group>
                <Group gap="md" align="center">
                    <Group gap="xs">
                        <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
                        <Text size="sm" c="dimmed">
                            {dayjs(post.createdAt).format('YYYY-MM-DD')}
                        </Text>
                    </Group>
                    {post.viewsCount && post.viewsCount > 20 && (
                        <Group gap="xs">
                            <IconEye size={16} color="var(--mantine-color-dimmed)" />
                            <Text size="sm" c="dimmed">
                                {post.viewsCount / 10}K
                            </Text>
                        </Group>
                    )}
                </Group>
            </Stack>
        </Card>
    );
}
