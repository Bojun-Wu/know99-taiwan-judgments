import { Link } from '@inertiajs/react';
import { ActionIcon, Burger, Button, Group, useMantineColorScheme } from '@mantine/core';
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

    const toggleColorScheme = () => {
        const nextColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(nextColorScheme);
        setCookie('mantine-color-scheme', nextColorScheme);
    };

    return (
        <Group justify="space-between" px="md" h="100%">
            <Group align="flex-end">
                <Burger opened={opened} onClick={toggle} size="sm" color="gray" hiddenFrom="sm" />
                <Button component={Link} href={route('home')} variant="subtle" color="gray" size="compact-lg" leftSection={<IconGavel size={24} />}>
                    Know99 判決書
                </Button>
                <Group visibleFrom="sm" gap="xs">
                    <Button component={Link} href={route('verdicts.index')} variant="subtle" size="compact-md" color="gray">
                        判決書
                    </Button>
                    <Button component={Link} href={route('posts.index')} variant="subtle" size="compact-md" color="gray">
                        專欄文章
                    </Button>
                    <Button component={Link} href={route('entities.index')} variant="subtle" size="compact-md" color="gray">
                        人名與組織資料庫
                    </Button>
                    <Button component={Link} href={route('about')} variant="subtle" size="compact-md" color="gray">
                        關於 Know99
                    </Button>
                </Group>
            </Group>

            <ActionIcon onClick={() => toggleColorScheme()} variant="transparent" size="lg" color="gray" aria-label="Toggle color scheme">
                {colorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
            </ActionIcon>
        </Group>
    );
}
