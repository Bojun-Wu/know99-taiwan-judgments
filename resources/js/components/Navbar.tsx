import { Link } from '@inertiajs/react';
import { NavLink, Stack } from '@mantine/core';
import { IconBooks } from './Icons/IconBooks';
import { IconFileText } from './Icons/IconFileText';
import { IconHome } from './Icons/IconHome';
import { IconInfoCircle } from './Icons/IconInfoCircle';
import { IconLabel } from './Icons/IconLabel';
import { IconTrendingUp } from './Icons/IconTrendingUp';

export default function Navbar() {
    const navItems = [
        { label: '首頁', href: route('home'), icon: IconHome },
        { label: '熱門判決書', href: route('verdicts.trending'), icon: IconTrendingUp },
        { label: '所有判決書', href: route('verdicts.index'), icon: IconBooks },
        { label: '人名與組織資料庫', href: route('entities.index'), icon: IconLabel },
        { label: '專欄文章', href: route('posts.index'), icon: IconFileText },
        { label: '關於 Know99', href: route('about'), icon: IconInfoCircle },
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
