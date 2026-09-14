import { useLocalizedRoute } from '@/i18n/routes';
import Layout from '@/layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
    status: number;
}

export default function ErrorPage({ status }: Props) {
    const { t } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const errorKey = [403, 404, 500, 503].includes(status) ? status.toString() : 'default';
    const error = { title: t(`errors.${errorKey}.title`), description: t(`errors.${errorKey}.description`) };

    return (
        <Layout>
            <Head>
                <title>{error.title}</title>
                <meta name="description" content={error.description} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <Container size="sm" py="xl">
                <Stack align="center" gap="xl">
                    <Title order={1} ta="center">
                        {error.title}
                    </Title>
                    <Text c="dimmed" size="lg" ta="center">
                        {error.description}
                    </Text>
                    <Button component={Link} href={localizedRoute('home')} size="lg">
                        {t('errors.home')}
                    </Button>
                </Stack>
            </Container>
        </Layout>
    );
}
