import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button, Container, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

export default function Login() {
    const { errors } = usePage<SharedData>().props;

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (errors) {
            form.setErrors(errors);
        }
    }, [errors]);

    const handleSubmit = form.onSubmit((values) => {
        router.post(route('admin.login'), values);
    });

    return (
        <>
            <Head>
                <title>Admin Login - Know99判決書</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <Container size="xs" h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper shadow="md" p="xl" radius="md" w={400}>
                    <Stack>
                        <Title order={2} ta="center">
                            Admin Login
                        </Title>

                        <form onSubmit={handleSubmit}>
                            <Stack>
                                <TextInput label="Email" placeholder="Enter your email" {...form.getInputProps('email')} required />

                                <PasswordInput label="Password" placeholder="Enter your password" {...form.getInputProps('password')} required />

                                <Button type="submit" fullWidth>
                                    Login
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Container>
        </>
    );
}
