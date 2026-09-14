import { IconArchive } from '@/components/Icons/IconArchive';
import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse, SharedData } from '@/types';
import { Court, Organization, Person, Verdict, VerdictSummary } from '@/types/verdict';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ActionIcon,
    Anchor,
    Badge,
    Button,
    Grid,
    Group,
    HoverCard,
    MultiSelect,
    NumberInput,
    Paper,
    Select,
    Stack,
    Table,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface Props {
    verdict: ResourceResponse<Verdict>;
    courts: ResourceResponse<Court[]>;
    people: ResourceResponse<Person[]>;
    organizations: ResourceResponse<Organization[]>;
}

export default function AdminVerdictEdit({ verdict, courts, people, organizations }: Props) {
    const { errors } = usePage<SharedData>().props;
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            verdict_id: verdict.data.verdictId,
            year: verdict.data.year,
            category: verdict.data.category,
            number: verdict.data.number,
            title: verdict.data.title,
            content: verdict.data.content,
            judgement_date: verdict.data.judgementDate,
            type: verdict.data.type,
            court_id: verdict.data.court?.id.toString() || '',
            people: verdict.data.people?.map((p) => p.id.toString()) || [],
            organizations: verdict.data.organizations?.map((o) => o.id.toString()) || [],
            keywords: verdict.data.keywords?.join(',') || null,
        },
        initialErrors: errors,
        transformValues(values) {
            return {
                ...values,
                keywords: values.keywords?.split(',') || null,
            };
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        router.put(route('admin.verdicts.update', verdict.data.id), values);
    });

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    return (
        <AdminLayout>
            <Head title="Edit Verdict" />

            <Stack gap="lg">
                <Group>
                    <Button component={Link} href={route('admin.verdicts.index')} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                        Back to Verdicts
                    </Button>
                </Group>
                <Group justify="space-between">
                    <Group gap="xs" align="flex-end">
                        <Title order={2}>Edit Verdict</Title>
                        <Group gap="xs" align="flex-end">
                            <Text c="dimmed">{verdict.data.verdictId}</Text>
                            <Anchor href={route('verdicts.show', verdict.data.verdictId)} target="_blank">
                                <IconExternalLink size={16} />
                            </Anchor>
                        </Group>
                    </Group>
                    <Badge size="lg">{verdict.data.id}</Badge>
                </Group>

                <Paper shadow="xs" p="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <Grid align="flex-end">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <NumberInput label="年度" key={form.key('year')} {...form.getInputProps('year')} />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="字號" key={form.key('category')} {...form.getInputProps('category')} />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="案號" key={form.key('number')} {...form.getInputProps('number')} />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput label="標題" key={form.key('title')} {...form.getInputProps('title')} />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        type="date"
                                        label="判決日期"
                                        key={form.key('judgement_date')}
                                        {...form.getInputProps('judgement_date')}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="類型"
                                        key={form.key('type')}
                                        {...form.getInputProps('type')}
                                        data={['憲法', '民事', '刑事', '行政', '懲戒', '其他']}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="法院"
                                        key={form.key('court_id')}
                                        {...form.getInputProps('court_id')}
                                        data={courts.data.map((court) => ({ value: court.id.toString(), label: court.name }))}
                                        placeholder="Select a court"
                                        searchable
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <MultiSelect
                                        label="People"
                                        key={form.key('people')}
                                        {...form.getInputProps('people')}
                                        data={people.data.map((person) => ({ value: person.id.toString(), label: person.name }))}
                                        clearable
                                        searchable
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <MultiSelect
                                        label="Organizations"
                                        key={form.key('organizations')}
                                        {...form.getInputProps('organizations')}
                                        data={organizations.data.map((org) => ({ value: org.id.toString(), label: org.name }))}
                                        clearable
                                        searchable
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Keywords"
                                        key={form.key('keywords')}
                                        placeholder="Enter keywords separated by commas"
                                        description="用逗號分隔，結尾不要有逗號"
                                        {...form.getInputProps('keywords')}
                                    />
                                </Grid.Col>

                                <Grid.Col span={12}>
                                    <Textarea
                                        label="全文"
                                        key={form.key('content')}
                                        {...form.getInputProps('content')}
                                        minRows={10}
                                        maxRows={20}
                                        autosize
                                    />
                                </Grid.Col>
                            </Grid>

                            <Group justify="flex-end">
                                <Button type="submit">Update Verdict</Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>

                {/* Summaries Section */}
                <Paper shadow="xs" p="md">
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Title order={3}>Verdict Summaries</Title>
                            <Button
                                component={Link}
                                href={route('admin.verdict-summaries.index')}
                                variant="subtle"
                                rightSection={<IconExternalLink size={16} />}
                            >
                                View All Summaries
                            </Button>
                        </Group>

                        {verdict.data.summaries && verdict.data.summaries.length > 0 ? (
                            <Table.ScrollContainer minWidth={1000}>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>ID</Table.Th>
                                            <Table.Th>Summary</Table.Th>
                                            <Table.Th>Votes</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Created At</Table.Th>
                                            <Table.Th>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {verdict.data.summaries.map((summary: VerdictSummary) => (
                                            <Table.Tr key={summary.id}>
                                                <Table.Td>{summary.id}</Table.Td>
                                                <Table.Td w={500}>
                                                    <HoverCard width={400} position="left">
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
                                                <Table.Td>
                                                    <Group gap="xs">
                                                        <Badge color="green" size="md">
                                                            👍 {summary.upvotesZh}
                                                        </Badge>
                                                        <Badge color="red" size="md">
                                                            👎 {summary.downvotesZh}
                                                        </Badge>
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge color={summary.status === 'active' ? 'green' : 'red'} size="sm">
                                                        {summary.status === 'active' ? 'Active' : 'Deprecated'}
                                                    </Badge>
                                                </Table.Td>
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
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No summaries found for this verdict.
                            </Text>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </AdminLayout>
    );
}
