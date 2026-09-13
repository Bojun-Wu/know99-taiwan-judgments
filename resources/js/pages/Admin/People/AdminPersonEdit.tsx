import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconEdit } from '@/components/Icons/IconEdit';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse, SharedData } from '@/types';
import { Person } from '@/types/verdict';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ActionIcon, Anchor, Badge, Button, Group, Paper, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

interface Props {
    person: ResourceResponse<Person>;
}

export default function AdminPersonEdit({ person }: Props) {
    const { errors } = usePage<SharedData>().props;

    const form = useForm({
        initialValues: {
            name: person.data.name,
        },
        initialErrors: errors,
    });

    const handleSubmit = form.onSubmit((values) => {
        router.put(route('admin.people.update', person.data.id), values);
    });

    const handleDetachVerdict = (verdictId: number) => {
        router.delete(route('admin.people.verdicts.detach', [person.data.id, verdictId]));
    };

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    return (
        <AdminLayout>
            <Head title="Edit Person" />

            <Stack gap="lg">
                <Group>
                    <Button component={Link} href={route('admin.people.index')} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                        Back to People
                    </Button>
                </Group>
                <Group justify="space-between">
                    <Group gap="xs" align="flex-end">
                        <Title order={2}>Edit Person</Title>
                    </Group>
                </Group>

                <Paper shadow="xs" p="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />
                            <Group justify="flex-end">
                                <Button type="submit">Update Person</Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>

                <Paper shadow="xs" p="md">
                    <Stack gap="md">
                        <Title order={3}>Connected Verdicts</Title>
                        <Table.ScrollContainer minWidth={800}>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>ID</Table.Th>
                                        <Table.Th>Verdict ID</Table.Th>
                                        <Table.Th>Title</Table.Th>
                                        <Table.Th>Type</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {person.data.verdicts?.map((verdict) => (
                                        <Table.Tr key={verdict.id}>
                                            <Table.Td>{verdict.id}</Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <Text>{verdict.verdictId}</Text>
                                                    <Anchor href={route('verdicts.show', verdict.verdictId)} target="_blank">
                                                        <IconExternalLink size={16} />
                                                    </Anchor>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>{verdict.title}</Table.Td>
                                            <Table.Td>
                                                <Badge>{verdict.type}</Badge>
                                            </Table.Td>
                                            <Table.Td>{verdict.judgementDate}</Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <ActionIcon
                                                        variant="light"
                                                        component={Link}
                                                        href={route('admin.verdicts.edit', verdict.id)}
                                                        color="blue"
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                    <Button size="xs" variant="light" color="red" onClick={() => handleDetachVerdict(verdict.id)}>
                                                        Detach
                                                    </Button>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Stack>
                </Paper>
            </Stack>
        </AdminLayout>
    );
}
