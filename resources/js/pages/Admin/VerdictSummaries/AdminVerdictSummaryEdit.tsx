import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse } from '@/types';
import { VerdictSummary } from '@/types/verdict';
import { Head, Link, router } from '@inertiajs/react';
import { ActionIcon, Button, Grid, Group, Paper, Select, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
    summary: ResourceResponse<VerdictSummary>;
}

export default function AdminVerdictSummaryEdit({ summary }: Props) {
    const form = useForm({
        initialValues: {
            summary_zh: summary.data.summaryZh,
            summary_en: summary.data.summaryEn,
            upvotes_zh: summary.data.upvotesZh,
            downvotes_zh: summary.data.downvotesZh,
            upvotes_en: summary.data.upvotesEn,
            downvotes_en: summary.data.downvotesEn,
            status: summary.data.status,
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        router.put(route('admin.verdict-summaries.update', summary.data.id), values);
    });

    return (
        <AdminLayout>
            <Head title="Edit Verdict Summary" />

            <Stack gap="lg">
                <Group>
                    <Button component={Link} href={route('admin.verdict-summaries.index')} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                        Back to Summaries
                    </Button>
                </Group>

                <Title order={2}>Edit Verdict Summary {summary.data.id}</Title>

                <Paper shadow="xs" p="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <Grid>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="Verdict ID" value={summary.data.verdictId} disabled />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Group gap="xs" align="flex-end">
                                        <TextInput label="Verdict Slug" value={summary.data.verdict?.verdictId} disabled flex={1} />
                                        <ActionIcon
                                            size="lg"
                                            component={Link}
                                            href={route('admin.verdicts.edit', summary.data.verdict?.id)}
                                            variant="subtle"
                                        >
                                            <IconExternalLink size={24} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>

                                <Grid.Col span={12}>
                                    <Textarea label="Chinese Summary" {...form.getInputProps('summary_zh')} minRows={4} maxRows={8} autosize required />
                                </Grid.Col>

                                <Grid.Col span={12}>
                                    <Textarea label="English Summary" {...form.getInputProps('summary_en')} minRows={4} maxRows={8} autosize required />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="Chinese Upvotes" type="number" {...form.getInputProps('upvotes_zh')} min={0} required />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="Chinese Downvotes" type="number" {...form.getInputProps('downvotes_zh')} min={0} required />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="English Upvotes" type="number" {...form.getInputProps('upvotes_en')} min={0} required />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="English Downvotes" type="number" {...form.getInputProps('downvotes_en')} min={0} required />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="Status"
                                        {...form.getInputProps('status')}
                                        data={[
                                            { value: 'active', label: 'Active' },
                                            { value: 'deprecated', label: 'Deprecated' },
                                        ]}
                                        required
                                    />
                                </Grid.Col>
                            </Grid>

                            <Group justify="flex-end">
                                <Button component={Link} href={route('admin.verdict-summaries.index')} variant="subtle">
                                    Cancel
                                </Button>
                                <Button type="submit">Update Summary</Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </AdminLayout>
    );
}
