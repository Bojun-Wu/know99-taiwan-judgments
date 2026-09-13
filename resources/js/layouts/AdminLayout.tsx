import { IconArticle } from '@/components/Icons/IconArticle';
import { IconBooks } from '@/components/Icons/IconBooks';
import { IconBuilding } from '@/components/Icons/IconBuilding';
import { IconFileText } from '@/components/Icons/IconFileText';
import IconMoon from '@/components/Icons/IconMoon';
import { IconRun } from '@/components/Icons/IconRun';
import { IconScale } from '@/components/Icons/IconScale';
import IconSun from '@/components/Icons/IconSun';
import { IconUsers } from '@/components/Icons/IconUsers';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ActionIcon, AppShell, Burger, Button, Group, NavLink, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { PropsWithChildren, useEffect } from 'react';

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export default function AdminLayout({ children }: PropsWithChildren) {
    const [opened, { toggle }] = useDisclosure();
    const { auth, flash, ziggy } = usePage<SharedData>().props;
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    const toggleColorScheme = () => {
        const nextColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(nextColorScheme);
        setCookie('mantine-color-scheme', nextColorScheme);
    };

    const navItems = [
        // { icon: IconDashboard, label: 'Dashboard', href: route('admin.dashboard') },
        { icon: IconBooks, label: 'Verdicts', href: route('admin.verdicts.index') },
        { icon: IconFileText, label: 'Verdict Summaries', href: route('admin.verdict-summaries.index') },
        { icon: IconBuilding, label: 'Organizations', href: route('admin.organizations.index') },
        { icon: IconUsers, label: 'People', href: route('admin.people.index') },
        { icon: IconScale, label: 'Courts', href: route('admin.courts.index') },
        { icon: IconArticle, label: 'Posts', href: route('admin.posts.index') },
    ];

    useEffect(() => {
        if (flash?.message) {
            flash.message.forEach((message) => {
                notifications.show({
                    title: message.title,
                    message: message.message,
                    color: message.color || 'blue',
                });
            });
        }
    }, [flash]);

    return (
        <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'xs', collapsed: { mobile: !opened, desktop: opened } }} padding="md">
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group gap="xs">
                        <Burger onClick={toggle} size="sm" />
                        <Button component={Link} href={route('admin.dashboard')} variant="subtle" size="compact-md" color="gray">
                            Admin Panel
                        </Button>
                    </Group>
                    <Group gap="xs">
                        <Text size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} fw={700} visibleFrom="xs">
                            {auth.user.data.name}
                        </Text>
                        <ActionIcon onClick={() => toggleColorScheme()} variant="transparent" size="lg" color="gray">
                            {colorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
                        </ActionIcon>
                        <Button component={Link} href={route('admin.logout')} method="post" variant="subtle" color="gray" size="compact-md">
                            Logout
                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack justify="space-between" h="100%">
                    <Stack gap="xs">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.href}
                                component={Link}
                                href={item.href}
                                label={item.label}
                                leftSection={<item.icon size={24} />}
                                active={ziggy.location.startsWith(item.href)}
                                styles={{
                                    root: {
                                        borderRadius: 'var(--mantine-radius-md)',
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                    <Button component={Link} href={route('home')} variant="subtle" color="gray" leftSection={<IconRun size={24} />}>
                        回到 Know99 官網
                    </Button>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
