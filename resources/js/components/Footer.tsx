import { useLocalizedRoute } from '@/i18n/routes';
import { Link } from '@inertiajs/react';
import { Anchor, Container, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    return (
        <Container size="lg" py="md">
            <Stack gap={5}>
                <Group justify="center" gap="lg" mb="md">
                    <Anchor component={Link} href={localizedRoute('home')} c="dimmed" size="sm">
                        {t('nav.home')}
                    </Anchor>
                    <Anchor component={Link} href={localizedRoute('verdicts.trending')} c="dimmed" size="sm">
                        {t('nav.trending')}
                    </Anchor>
                    <Anchor component={Link} href={localizedRoute('verdicts.index')} c="dimmed" size="sm">
                        {t('nav.verdicts')}
                    </Anchor>
                    <Anchor component={Link} href={localizedRoute('posts.index')} c="dimmed" size="sm">
                        {t('nav.posts')}
                    </Anchor>
                    <Anchor component={Link} href={localizedRoute('entities.index')} c="dimmed" size="sm">
                        {t('nav.entities')}
                    </Anchor>
                    <Anchor component={Link} href={localizedRoute('about')} c="dimmed" size="sm">
                        {t('nav.about')}
                    </Anchor>
                </Group>
                <Text c="dimmed" ta="center" size="sm">
                    {t('footer.disclaimer')}
                </Text>
                <Group justify="center" gap="lg">
                    <Anchor c="dimmed" ta="center" size="sm" href="mailto:contact@know99.com" target="_blank">
                        {t('footer.contact')}
                    </Anchor>
                    <Text c="dimmed" ta="center" size="sm">
                        {t('footer.copyright', { year: dayjs().format('YYYY') })}
                    </Text>
                </Group>
            </Stack>
        </Container>
    );
}
