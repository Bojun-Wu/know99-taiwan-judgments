import AdminLayout from '@/layouts/AdminLayout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button, Group, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

export default function AdminPersonCreate() {
    const { errors } = usePage<SharedData>().props;

    const form = useForm({
        initialValues: {
            name: '',
        },
        initialErrors: errors,
    });

    const handleSubmit = form.onSubmit((values) => {
        router.post(route('admin.people.store'), values);
    });

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    return (
        <AdminLayout>
            <Head title="Create Person" />

            <Stack gap="lg">
                <Group justify="space-between">
                    <Group gap="xs" align="flex-end">
                        <Title order={2}>Create Person</Title>
                    </Group>
                </Group>

                <Paper shadow="xs" p="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />

                            <Group justify="flex-end">
                                <Button type="submit">Create Person</Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </AdminLayout>
    );
}
