import { IconArrowLeft } from '@/components/Icons/IconArrowLeft';
import { IconExternalLink } from '@/components/Icons/IconExternalLink';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse, SharedData } from '@/types';
import { Organization } from '@/types/verdict';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ActionIcon, Button, Group, Paper, Stack, Table, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

interface Props {
    organization: ResourceResponse<Organization>;
}

export default function AdminOrganizationEdit({ organization }: Props) {
    const { errors } = usePage<SharedData>().props;

    const form = useForm({
        initialValues: {
            name: organization.data.name,
        },
        initialErrors: errors,
    });

    const handleSubmit = form.onSubmit((values) => {
        router.put(route('admin.organizations.update', organization.data.id), values);
    });

    const handleDetachVerdict = (verdictId: number) => {
        router.delete(route('admin.organizations.verdicts.detach', [organization.data.id, verdictId]));
    };

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    return (
        <AdminLayout>
            <Head title="Edit Organization" />

            <Stack gap="lg">
                <Group>
                    <Button component={Link} href={route('admin.organizations.index')} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                        Back to Organizations
                    </Button>
                </Group>
                <Group justify="space-between">
                    <Group gap="xs" align="flex-end">
                        <Title order={2}>Edit Organization</Title>
                    </Group>
                </Group>

                <Paper shadow="xs" p="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />

                            <Group justify="flex-end">
                                <Button type="submit">Update Organization</Button>
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
                                    {organization.data.verdicts?.map((verdict) => (
                                        <Table.Tr key={verdict.id}>
                                            <Table.Td>{verdict.id}</Table.Td>
                                            <Table.Td>{verdict.verdictId}</Table.Td>
                                            <Table.Td>{verdict.title}</Table.Td>
                                            <Table.Td>{verdict.type}</Table.Td>
                                            <Table.Td>{verdict.judgementDate}</Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <ActionIcon
                                                        variant="light"
                                                        component={Link}
                                                        href={route('admin.verdicts.edit', verdict.id)}
                                                        color="blue"
                                                    >
                                                        <IconExternalLink size={16} />
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
