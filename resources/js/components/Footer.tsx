import { Link } from '@inertiajs/react';
import { Anchor, Container, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';

export default function Footer() {
    return (
        <Container size="lg" py="md">
            <Stack gap={5}>
                <Group justify="center" gap="lg" mb="md">
                    <Anchor component={Link} href={route('home')} c="dimmed" size="sm">
                        首頁
                    </Anchor>
                    <Anchor component={Link} href={route('verdicts.trending')} c="dimmed" size="sm">
                        熱門判決書
                    </Anchor>
                    <Anchor component={Link} href={route('verdicts.index')} c="dimmed" size="sm">
                        所有判決書
                    </Anchor>
                    <Anchor component={Link} href={route('posts.index')} c="dimmed" size="sm">
                        專欄文章
                    </Anchor>
                    <Anchor component={Link} href={route('entities.index')} c="dimmed" size="sm">
                        人名與組織資料庫
                    </Anchor>
                    <Anchor component={Link} href={route('about')} c="dimmed" size="sm">
                        關於 Know99
                    </Anchor>
                </Group>
                <Text c="dimmed" ta="center" size="sm">
                    本網站部分內容為 AI 生成，僅供參考。請勿將其視為法律建議。
                </Text>
                <Group justify="center" gap="lg">
                    <Anchor c="dimmed" ta="center" size="sm" href="mailto:contact@know99.com" target="_blank">
                        聯絡我們：contact@know99.com
                    </Anchor>
                    <Text c="dimmed" ta="center" size="sm">
                        © {dayjs().format('YYYY')} Know99. All rights reserved.
                    </Text>
                </Group>
            </Stack>
        </Container>
    );
}
