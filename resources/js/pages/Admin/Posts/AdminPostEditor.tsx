import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import IconChevronDown from '@/components/Icons/IconChevronDown';
import IconChevronRight from '@/components/Icons/IconChevronRight';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import PostPreview from '@/components/PostPreview/PostPreview';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse, SharedData } from '@/types';
import { AdminPost } from '@/types/post';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ActionIcon,
    Anchor,
    Box,
    Button,
    Code,
    Collapse,
    Divider,
    FileInput,
    Grid,
    Group,
    Image,
    Modal,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
    TypographyStylesProvider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// update的時候，有post，但是postCount會是undefined
// create的時候，沒有post，但是postCount會是number
type Props =
    | {
          post: ResourceResponse<AdminPost>;
          postCount?: undefined;
      }
    | {
          post?: undefined;
          postCount: number;
      };

export default function AdminPostEditor({ post, postCount }: Props) {
    const [opened, { toggle }] = useDisclosure(false);
    const [previewOpened, { close: closePreview, open: openPreview }] = useDisclosure(false);
    const [instructionOpened, { close: closeInstruction, open: openInstruction }] = useDisclosure(false);
    const { errors } = usePage<SharedData>().props;
    const form = useForm({
        initialValues: {
            title: post?.data.title ?? '',
            slug: post?.data.slug ?? '',
            body: post?.data.body ?? '',
            excerpt: post?.data.excerpt ?? '',
            status: post?.data.status ?? 'draft',
            meta_description: post?.data.metaDescription ?? '',
            author: post?.data.author ?? '',
            cover_image: null as File | null,
            thumbnail: null as File | null,
            clear_cover_image: false,
            clear_thumbnail: false,
        },
        initialErrors: errors,
    });

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    const handleSubmit = form.onSubmit((values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'boolean') {
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        if (post) {
            router.post(
                route('admin.posts.update', { post: post.data.id }),
                {
                    ...values,
                    _method: 'PUT',
                },
                {
                    forceFormData: true,
                    onSuccess: () => location.reload(),
                },
            );
        } else {
            router.post(route('admin.posts.store'), formData, {
                forceFormData: true,
            });
        }
    });

    const handleClearImage = (type: 'cover_image' | 'thumbnail') => {
        form.setFieldValue(type, null);
        form.setFieldValue(`clear_${type}`, true);
    };

    function constructPost(values: typeof form.values) {
        return {
            title: values.title,
            body: values.body,
            author: values.author || 'Know99 小助手',
            coverImageUrl: post
                ? values.clear_cover_image
                    ? values.cover_image
                        ? URL.createObjectURL(values.cover_image)
                        : null
                    : post.data.coverImageUrl
                : values.cover_image
                  ? URL.createObjectURL(values.cover_image)
                  : null,
            thumbnailUrl: post
                ? values.clear_thumbnail
                    ? values.thumbnail
                        ? URL.createObjectURL(values.thumbnail)
                        : null
                    : post.data.thumbnailUrl
                : values.thumbnail
                  ? URL.createObjectURL(values.thumbnail)
                  : null,
        };
    }

    return (
        <AdminLayout>
            <Modal opened={previewOpened} onClose={closePreview} title="預覽" fullScreen>
                <PostPreview post={constructPost(form.getValues())} />
            </Modal>

            <form onSubmit={handleSubmit}>
                <Stack>
                    <Group>
                        <Button component={Link} href={route('admin.posts.index')} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                            Back to Posts
                        </Button>
                    </Group>
                    <Group gap="xs" justify="space-between">
                        <Group align="flex-end">
                            <Title order={3}>{post ? `編輯文章 ID: ${post.data.id}` : `新增文章（暫訂 ID: ${postCount + 1}）`}</Title>
                            {post && (
                                <Anchor href={route('posts.show', post.data.slug)} target="_blank">
                                    <IconExternalLink size={16} />
                                </Anchor>
                            )}
                        </Group>
                        <Button variant="subtle" onClick={openInstruction} leftSection={<IconInfoCircle size={16} />}>
                            使用說明
                        </Button>
                        <Modal opened={instructionOpened} onClose={closeInstruction} title="Markdown 編輯說明" size="xl">
                            <Stack>
                                <Paper withBorder p="md">
                                    <Stack gap="xs">
                                        <Title order={6}>圖片上傳</Title>
                                        <Text size="sm" c="dimmed">
                                            新增文章圖片請至&nbsp;
                                            <Anchor
                                                href="https://dash.cloudflare.com/cf81fcc742fc06b76188e4fd8d651729/r2/default/buckets/know99"
                                                target="_blank"
                                                fw={500}
                                            >
                                                R2
                                            </Anchor>
                                            &nbsp;posts/content/{post ? post.data.id : postCount + 1}資料夾上傳，並將連結複製回來
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            連結格式：https://r2.know99.com/posts/content/{post ? post.data.id : postCount + 1}/圖片名稱.webp
                                        </Text>
                                    </Stack>
                                </Paper>
                                <Paper withBorder p="md">
                                    <Stack gap="xs">
                                        <Title order={6}>連結</Title>
                                        <Text size="sm" c="dimmed">
                                            直接使用 a tag 即可，例如：
                                        </Text>
                                        <Code block>&lt;a href="https://www.google.com" target="_blank"&gt;Google&lt;/a&gt;</Code>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Modal>
                    </Group>
                    <Paper shadow="xs" p="md" withBorder>
                        <Group justify="space-between" onClick={toggle} style={{ cursor: 'pointer' }}>
                            <Title order={5}>基本資料</Title>
                            <ActionIcon variant="subtle">{opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}</ActionIcon>
                        </Group>
                        <Collapse in={opened}>
                            <Grid gutter="md" mt="md">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="Title" placeholder="Post title" required {...form.getInputProps('title')} />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Slug"
                                        placeholder="Post slug"
                                        description="文章網址（需唯一，如果沒有輸入，會自動使用 title 加上 dash 成為文章網址）"
                                        {...form.getInputProps('slug')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Textarea
                                        label="摘錄"
                                        description="作為 post 縮圖使用，會顯示在 post 列表中，如果沒有輸入，會自動使用 body 的前 100 個字元"
                                        placeholder="摘錄"
                                        minRows={2}
                                        {...form.getInputProps('excerpt')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Textarea
                                        label="Meta Description（SEO）"
                                        placeholder="Meta description for SEO"
                                        description="作為 post 的 meta description，如果沒有輸入，會自動使用 body 的前 100 個字元"
                                        minRows={2}
                                        {...form.getInputProps('meta_description')}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Stack>
                                        <FileInput
                                            label="封面圖片"
                                            description="文章封面圖片，如果沒有輸入，會顯示預設 env.IMAGE_FALLBACK_URL，有空的話 WebP 壓縮一下"
                                            accept="image/*"
                                            clearable
                                            {...form.getInputProps('cover_image')}
                                        />
                                        {post?.data.coverImageUrl && !form.values.clear_cover_image && (
                                            <Stack gap="xs">
                                                <Box mx="auto">
                                                    <Image src={post.data.coverImageUrl} h={150} w="auto" fit="contain" />
                                                </Box>
                                                <Button variant="light" color="red" size="xs" onClick={() => handleClearImage('cover_image')}>
                                                    清除圖片
                                                </Button>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Stack>
                                        <FileInput
                                            label="縮圖"
                                            description="文章縮圖，如果沒有輸入，會顯示預設 env.IMAGE_FALLBACK_URL，有空的話 WebP 壓縮一下"
                                            accept="image/*"
                                            clearable
                                            {...form.getInputProps('thumbnail')}
                                        />
                                        {post?.data.thumbnailUrl && !form.values.clear_thumbnail && (
                                            <Stack gap="xs">
                                                <Box mx="auto">
                                                    <Image src={post.data.thumbnailUrl} h={150} w="auto" fit="contain" />
                                                </Box>
                                                <Button variant="light" color="red" size="xs" onClick={() => handleClearImage('thumbnail')}>
                                                    清除圖片
                                                </Button>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Author"
                                        description="文章作者，如果沒有輸入，會顯示 Know99 小助手"
                                        placeholder="Author"
                                        {...form.getInputProps('author')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="Status"
                                        data={[
                                            { value: 'draft', label: '草稿' },
                                            { value: 'published', label: '發布' },
                                            { value: 'archived', label: '封存' },
                                        ]}
                                        required
                                        allowDeselect={false}
                                        {...form.getInputProps('status')}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Collapse>
                    </Paper>
                    <Divider my="lg" />
                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack>
                                <Title order={5}>內容（Markdown）</Title>
                                <Textarea
                                    placeholder="Write your post in markdown..."
                                    required
                                    minRows={20}
                                    autosize
                                    {...form.getInputProps('body')}
                                />
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack h="100%">
                                <Group justify="space-between">
                                    <Title order={5}>預覽</Title>
                                    <Button variant="light" size="compact-sm" onClick={openPreview}>
                                        全螢幕預覽
                                    </Button>
                                </Group>
                                <Paper withBorder p="md" flex={1} style={{ cursor: 'not-allowed' }}>
                                    <TypographyStylesProvider>
                                        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                            {form.values.body}
                                        </Markdown>
                                    </TypographyStylesProvider>
                                </Paper>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => router.visit(route('admin.posts.index'))}>
                            取消
                        </Button>
                        <Button type="submit">{post ? '更新' : '新增'}</Button>
                    </Group>
                </Stack>
            </form>
        </AdminLayout>
    );
}
