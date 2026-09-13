import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconEdit } from '@/components/Icons/IconEdit';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse, SharedData } from '@/types';
import { Court } from '@/types/verdict';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ActionIcon, Button, Group, Paper, Stack, Table, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

interface Props {
    court: ResourceResponse<Court>;
}

export default function AdminCourtEdit({ court }: Props) {
    const { errors } = usePage<SharedData>().props;

    const form = useForm({
        initialValues: {
            name: court.data.name,
        },
        initialErrors: errors,
    });

    const handleSubmit = form.onSubmit((values) => {
        router.put(route('admin.courts.update', court.data.id), values);
    });

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    return (
        <AdminLayout>
            <Head title="Edit Court" />

            <Stack gap="lg">
                <Group>
                    <Button component={Link} href={route('admin.courts.index')} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                        Back to Courts
                    </Button>
                </Group>
                <Group justify="space-between">
                    <Group gap="xs" align="flex-end">
                        <Title order={2}>Edit Court {court.data.id}</Title>
                    </Group>
                </Group>

                <Paper shadow="xs" p="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />

                            <Group justify="flex-end">
                                <Button type="submit">Update Court</Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>

                <Paper shadow="xs" p="md">
                    <Stack gap="md">
                        <Table.ScrollContainer minWidth={800}>
                            <Title order={3}>Connected Verdicts</Title>
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
                                    {court.data.verdicts?.map((verdict) => (
                                        <Table.Tr key={verdict.id}>
                                            <Table.Td>{verdict.id}</Table.Td>
                                            <Table.Td>{verdict.verdictId}</Table.Td>
                                            <Table.Td>{verdict.title}</Table.Td>
                                            <Table.Td>{verdict.type}</Table.Td>
                                            <Table.Td>{verdict.judgementDate}</Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <ActionIcon
                                                        component={Link}
                                                        href={route('admin.verdicts.edit', verdict.id)}
                                                        variant="light"
                                                        color="blue"
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
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
