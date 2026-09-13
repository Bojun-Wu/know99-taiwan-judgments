import { IconArrowNarrowLeft } from '@/components/Icons/IconArrowNarrowLeft';
import { IconCalendar } from '@/components/Icons/IconCalendar';
import { IconCopy } from '@/components/Icons/IconCopy';
import { IconLine } from '@/components/Icons/IconLine';
import { ActionIcon, Avatar, Box, Button, Container, Group, Image, Stack, Text, Title, TypographyStylesProvider } from '@mantine/core';
import dayjs from 'dayjs';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import classes from './PostPreview.module.css';

const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'brown'];

interface Props {
    post: {
        title: string;
        author: string;
        body: string;
        coverImageUrl: string | null;
        thumbnailUrl: string | null;
    };
}

export default function PostPreview({ post }: Props) {
    return (
        <Container size="lg" py="md">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Button variant="subtle" leftSection={<IconArrowNarrowLeft size={16} />}>
                        上一頁
                    </Button>
                    <Group>
                        <ActionIcon variant="outline" size="lg">
                            <IconLine />
                        </ActionIcon>
                        <ActionIcon variant="outline" size="lg">
                            <IconCopy />
                        </ActionIcon>
                    </Group>
                </Group>
                <Stack gap="xl" px={{ base: 'md', xs: 'xl' }} py={{ base: 0, xs: 'xl' }} classNames={{ root: classes.content }}>
                    <Box>
                        <Image src={post.coverImageUrl} height={400} fit="contain" radius="md" />
                    </Box>
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Title order={1} size="h2">
                                {post.title}
                            </Title>
                        </Group>
                        <Group justify="space-between" align="flex-start">
                            <Group gap="xs">
                                {/* random color */}
                                <Avatar size={28} radius="xl" color={colors[Math.floor(Math.random() * colors.length)]}>
                                    {post.author?.slice(0, 1).toUpperCase()}
                                </Avatar>
                                <Text size="sm" fw={500} c="dimmed">
                                    {post.author}
                                </Text>
                            </Group>
                            <Group gap={5}>
                                <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
                                <Text size="sm" c="dimmed">
                                    {dayjs().format('YYYY-MM-DD')}
                                </Text>
                            </Group>
                        </Group>
                        <TypographyStylesProvider mt="xl">
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {post.body}
                            </Markdown>
                        </TypographyStylesProvider>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
