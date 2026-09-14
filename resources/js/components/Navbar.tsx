import { useLocalizedRoute } from '@/i18n/routes';
import { Link } from '@inertiajs/react';
import { NavLink, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconBooks } from './Icons/IconBooks';
import { IconFileText } from './Icons/IconFileText';
import { IconHome } from './Icons/IconHome';
import { IconInfoCircle } from './Icons/IconInfoCircle';
import { IconLabel } from './Icons/IconLabel';
import { IconTrendingUp } from './Icons/IconTrendingUp';

export default function Navbar() {
    const { t } = useTranslation();
    const localizedRoute = useLocalizedRoute();
    const navItems = [
        { label: t('nav.home'), href: localizedRoute('home'), icon: IconHome },
        { label: t('nav.trending'), href: localizedRoute('verdicts.trending'), icon: IconTrendingUp },
        { label: t('nav.verdicts'), href: localizedRoute('verdicts.index'), icon: IconBooks },
        { label: t('nav.entities'), href: localizedRoute('entities.index'), icon: IconLabel },
        { label: t('nav.posts'), href: localizedRoute('posts.index'), icon: IconFileText },
        { label: t('nav.about'), href: localizedRoute('about'), icon: IconInfoCircle },
    ];

    return (
        <Stack gap="xs" p="md">
            {navItems.map((item) => (
                <NavLink
                    key={item.href}
                    label={item.label}
                    component={Link}
                    href={item.href}
                    leftSection={<item.icon size={24} />}
                    styles={{
                        root: {
                            borderRadius: 'var(--mantine-radius-md)',
                        },
                    }}
                />
            ))}
        </Stack>
    );
}
