import { localizedPath, useLocalizedRoute } from '@/i18n/routes';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ActionIcon, Burger, Button, Group, Tooltip, useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import IconGavel from './Icons/IconGavel';
import IconMoon from './Icons/IconMoon';
import IconSun from './Icons/IconSun';

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export default function Header({ opened, toggle }: { opened: boolean; toggle: () => void }) {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const { t } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const { locale } = usePage<SharedData>().props;

    const toggleColorScheme = () => {
        const nextColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(nextColorScheme);
        setCookie('mantine-color-scheme', nextColorScheme);
    };

    const switchLanguage = () => {
        const nextLocale = locale === 'en' ? 'zh-TW' : 'en';
        setCookie('locale', nextLocale);
        window.location.assign(localizedPath(`${window.location.pathname}${window.location.search}${window.location.hash}`, nextLocale));
    };

    return (
        <Group justify="space-between" px="md" h="100%">
            <Group align="flex-end">
                <Burger opened={opened} onClick={toggle} size="sm" color="gray" hiddenFrom="sm" />
                <Button
                    component={Link}
                    href={localizedRoute('home')}
                    variant="subtle"
                    color="gray"
                    size="compact-lg"
                    leftSection={<IconGavel size={24} />}
                >
                    {t('brand')}
                </Button>
                <Group visibleFrom="sm" gap="xs">
                    <Button component={Link} href={localizedRoute('verdicts.index')} variant="subtle" size="compact-md" color="gray">
                        {t('nav.verdictsShort')}
                    </Button>
                    <Button component={Link} href={localizedRoute('posts.index')} variant="subtle" size="compact-md" color="gray">
                        {t('nav.posts')}
                    </Button>
                    <Button component={Link} href={localizedRoute('entities.index')} variant="subtle" size="compact-md" color="gray">
                        {t('nav.entities')}
                    </Button>
                    <Button component={Link} href={localizedRoute('about')} variant="subtle" size="compact-md" color="gray">
                        {t('nav.about')}
                    </Button>
                </Group>
            </Group>

            <Group gap="xs">
                <Tooltip label={t('language.switchTo')}>
                    <Button onClick={switchLanguage} variant="subtle" color="gray" size="compact-sm" aria-label={t('language.switchTo')}>
                        {locale === 'en' ? t('language.chinese') : t('language.english')}
                    </Button>
                </Tooltip>
                <ActionIcon onClick={() => toggleColorScheme()} variant="transparent" size="lg" color="gray" aria-label={t('theme.toggle')}>
                    {colorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
                </ActionIcon>
            </Group>
        </Group>
    );
}
