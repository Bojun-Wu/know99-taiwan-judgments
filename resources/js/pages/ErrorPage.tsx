import Layout from '@/layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { Button, Container, Stack, Text, Title } from '@mantine/core';

interface Props {
    status: number;
}

export default function ErrorPage({ status }: Props) {
    const getErrorMessage = () => {
        switch (status) {
            case 404:
                return {
                    title: '找不到頁面',
                    description: '您所尋找的頁面不存在或已被移除。',
                };
            case 403:
                return {
                    title: '存取被拒絕',
                    description: '您沒有權限存取此頁面。',
                };
            case 500:
                return {
                    title: '伺服器錯誤',
                    description: '抱歉，伺服器發生錯誤。請稍後再試。',
                };
            case 503:
                return {
                    title: '服務暫時無法使用',
                    description: '系統正在維護中，請稍後再試。',
                };
            default:
                return {
                    title: '發生錯誤',
                    description: '抱歉，發生未預期的錯誤。',
                };
        }
    };

    const error = getErrorMessage();

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
                    <Button component={Link} href={route('home')} size="lg">
                        返回首頁
                    </Button>
                </Stack>
            </Container>
        </Layout>
    );
}
