import { IconArticle } from '@/components/Icons/IconArticle';
import { IconBooks } from '@/components/Icons/IconBooks';
import { IconBuilding } from '@/components/Icons/IconBuilding';
import { IconEye } from '@/components/Icons/IconEye';
import { IconFileText } from '@/components/Icons/IconFileText';
import { IconScale } from '@/components/Icons/IconScale';
import { IconUsers } from '@/components/Icons/IconUsers';
import TrendingVerdictCard from '@/components/VerdictCard/TrendingVerdictCard';
import AdminLayout from '@/layouts/AdminLayout';
import { ResourceResponse } from '@/types';
import { Verdict } from '@/types/verdict';
import { Head, Link } from '@inertiajs/react';
import { Badge, Button, Divider, Group, Paper, ScrollArea, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface Stats {
    totalVerdicts: number;
    totalVerdictSummaries: number;
    totalOrganizations: number;
    totalPeople: number;
    totalPosts: number;
    totalCourts: number;
}

interface TrendingData {
    trendingVerdicts: ResourceResponse<Verdict[]>;
    trendingKeywords: string[];
}

interface VisitorStats {
    todayViews: number;
    yesterdayViews: number;
    thisWeekViews: number;
    lastWeekViews: number;
    thisMonthViews: number;
    lastMonthViews: number;
    todayDiff: number;
    todayPercent: number;
    weekDiff: number;
    weekPercent: number;
    monthDiff: number;
    monthPercent: number;
}

interface RecentVisitor {
    ip_address: string;
    last_visit: string;
}

interface Props {
    stats: Stats;
    verdictViewStats: VisitorStats;
    postViewStats: VisitorStats;
    trendingData: TrendingData;
    recentVisitors: RecentVisitor[];
}

export default function Dashboard({ stats, trendingData, verdictViewStats, postViewStats, recentVisitors }: Props) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <Stack gap="xl">
                <Title order={2}>Admin Dashboard</Title>

                {/* Basic Statistics Cards */}
                <SimpleGrid cols={{ base: 2, xs: 1, sm: 2, lg: 3 }}>
                    <Paper shadow="sm" p="lg" withBorder>
                        <Group>
                            <IconBooks size={32} />
                            <Stack gap={0}>
                                <Text size="lg" fw={500}>
                                    Verdicts
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats.totalVerdicts.toLocaleString()}
                                </Text>
                            </Stack>
                        </Group>
                        <Button component={Link} href={route('admin.verdicts.index')} variant="light" fullWidth mt="md">
                            Manage Verdicts
                        </Button>
                    </Paper>

                    <Paper shadow="sm" p="lg" withBorder>
                        <Group>
                            <IconFileText size={32} />
                            <Stack gap={0}>
                                <Text size="lg" fw={500}>
                                    Summaries
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats.totalVerdictSummaries.toLocaleString()}
                                </Text>
                            </Stack>
                        </Group>
                        <Button component={Link} href={route('admin.verdict-summaries.index')} variant="light" fullWidth mt="md">
                            Manage Verdict Summaries
                        </Button>
                    </Paper>

                    <Paper shadow="sm" p="lg" withBorder>
                        <Group>
                            <IconBuilding size={32} />
                            <Stack gap={0}>
                                <Text size="lg" fw={500}>
                                    Organizations
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats.totalOrganizations.toLocaleString()}
                                </Text>
                            </Stack>
                        </Group>
                        <Button component={Link} href={route('admin.organizations.index')} variant="light" fullWidth mt="md">
                            Manage Organizations
                        </Button>
                    </Paper>

                    <Paper shadow="sm" p="lg" withBorder>
                        <Group>
                            <IconUsers size={32} />
                            <Stack gap={0}>
                                <Text size="lg" fw={500}>
                                    People
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats.totalPeople.toLocaleString()}
                                </Text>
                            </Stack>
                        </Group>
                        <Button component={Link} href={route('admin.people.index')} variant="light" fullWidth mt="md">
                            Manage People
                        </Button>
                    </Paper>

                    <Paper shadow="sm" p="lg" withBorder>
                        <Group>
                            <IconScale size={32} />
                            <Stack gap={0}>
                                <Text size="lg" fw={500}>
                                    Courts
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats.totalCourts.toLocaleString()}
                                </Text>
                            </Stack>
                        </Group>
                        <Button component={Link} href={route('admin.courts.index')} variant="light" fullWidth mt="md">
                            Manage Courts
                        </Button>
                    </Paper>

                    <Paper shadow="sm" p="lg" withBorder>
                        <Group>
                            <IconArticle size={32} />
                            <Stack gap={0}>
                                <Text size="lg" fw={500}>
                                    Posts
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats.totalPosts.toLocaleString()}
                                </Text>
                            </Stack>
                        </Group>
                        <Button component={Link} href={route('admin.posts.index')} variant="light" fullWidth mt="md">
                            Manage Posts
                        </Button>
                    </Paper>
                </SimpleGrid>

                {/* View Statistics */}
                <Paper shadow="sm" p="lg" withBorder>
                    {/* Verdict View Statistics */}
                    <Stack gap="lg">
                        <Title order={3}>判決書瀏覽統計</Title>
                        <SimpleGrid cols={3}>
                            <Paper p="md" withBorder>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        近 24 小時
                                    </Text>
                                    <Text size="xl" fw={700}>
                                        {verdictViewStats.todayViews.toLocaleString()}
                                    </Text>
                                    <Group gap={5}>
                                        <Text size="xs" c={verdictViewStats.todayDiff >= 0 ? 'green' : 'red'}>
                                            {verdictViewStats.todayDiff >= 0 ? '+' : ''}
                                            {verdictViewStats.todayPercent.toLocaleString()}%
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            vs
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            前 24 小時 ({verdictViewStats.yesterdayViews.toLocaleString()})
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        近 7 天
                                    </Text>
                                    <Text size="xl" fw={700}>
                                        {verdictViewStats.thisWeekViews.toLocaleString()}
                                    </Text>
                                    <Group gap={5}>
                                        <Text size="xs" c={verdictViewStats.weekDiff >= 0 ? 'green' : 'red'}>
                                            {verdictViewStats.weekDiff >= 0 ? '+' : ''}
                                            {verdictViewStats.weekPercent.toLocaleString()}%
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            vs
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            前 7 天 ({verdictViewStats.lastWeekViews.toLocaleString()})
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        近 30 天
                                    </Text>
                                    <Text size="xl" fw={700}>
                                        {verdictViewStats.thisMonthViews.toLocaleString()}
                                    </Text>
                                    <Group gap={5}>
                                        <Text size="xs" c={verdictViewStats.monthDiff >= 0 ? 'green' : 'red'}>
                                            {verdictViewStats.monthDiff >= 0 ? '+' : ''}
                                            {verdictViewStats.monthPercent.toLocaleString()}%
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            vs
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            前 30 天 ({verdictViewStats.lastMonthViews.toLocaleString()})
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>
                        </SimpleGrid>
                    </Stack>

                    <Divider my="lg" />

                    {/* Post View Statistics */}
                    <Stack gap="lg">
                        <Title order={3}>文章瀏覽統計</Title>
                        <SimpleGrid cols={3}>
                            <Paper p="md" withBorder>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        近 24 小時
                                    </Text>
                                    <Text size="xl" fw={700}>
                                        {postViewStats.todayViews.toLocaleString()}
                                    </Text>
                                    <Group gap={5}>
                                        <Text size="xs" c={postViewStats.todayDiff >= 0 ? 'green' : 'red'}>
                                            {postViewStats.todayDiff >= 0 ? '+' : ''}
                                            {postViewStats.todayPercent.toLocaleString()}%
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            vs
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            前 24 小時 ({postViewStats.yesterdayViews.toLocaleString()})
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        近 7 天
                                    </Text>
                                    <Text size="xl" fw={700}>
                                        {postViewStats.thisWeekViews.toLocaleString()}
                                    </Text>
                                    <Group gap={5}>
                                        <Text size="xs" c={postViewStats.weekDiff >= 0 ? 'green' : 'red'}>
                                            {postViewStats.weekDiff >= 0 ? '+' : ''}
                                            {postViewStats.weekPercent.toLocaleString()}%
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            vs
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            前 7 天 ({postViewStats.lastWeekViews.toLocaleString()})
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        近 30 天
                                    </Text>
                                    <Text size="xl" fw={700}>
                                        {postViewStats.thisMonthViews.toLocaleString()}
                                    </Text>
                                    <Group gap={5}>
                                        <Text size="xs" c={postViewStats.monthDiff >= 0 ? 'green' : 'red'}>
                                            {postViewStats.monthDiff >= 0 ? '+' : ''}
                                            {postViewStats.monthPercent.toLocaleString()}%
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            vs
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            前 30 天 ({postViewStats.lastMonthViews.toLocaleString()})
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>
                        </SimpleGrid>
                    </Stack>
                </Paper>

                {/* Trending Keywords */}
                <Paper shadow="sm" p="lg" withBorder>
                    <Stack gap="lg">
                        <Title order={3}>近 30 天熱門關鍵字</Title>
                        <Group gap="xs">
                            {trendingData.trendingKeywords.map((keyword, index) => (
                                <Badge key={keyword} color="blue" variant="light" size="lg">
                                    {keyword}
                                </Badge>
                            ))}
                        </Group>
                    </Stack>
                </Paper>

                {/* Recent Visitors */}
                <Paper shadow="sm" p="lg" withBorder>
                    <Stack gap="xs">
                        <Group mb="lg">
                            <IconEye size={24} />
                            <Title order={3}>Recent Visitors (Last 24h)</Title>
                        </Group>
                        <ScrollArea h={300}>
                            <SimpleGrid cols={{ base: 2, xs: 1, md: 2, lg: 3 }}>
                                {recentVisitors.map((visitor, index) => (
                                    <Paper key={index} p="xs" withBorder>
                                        <Group justify="space-between" p="xs">
                                            <Text size="sm">{visitor.ip_address}</Text>
                                            <Text size="xs" c="dimmed">
                                                {dayjs(visitor.last_visit).format('MM-DD HH:mm')}
                                            </Text>
                                        </Group>
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        </ScrollArea>
                        {recentVisitors.length === 0 && (
                            <Text c="dimmed" ta="center" py="md">
                                No recent visitors
                            </Text>
                        )}
                    </Stack>
                </Paper>

                {/* Trending Verdicts */}
                <Paper shadow="sm" p="lg" withBorder>
                    <Stack gap="lg">
                        <Title order={3}>近 30 天熱門判決書</Title>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                            {trendingData.trendingVerdicts.data.map((verdict) => (
                                <TrendingVerdictCard key={verdict.id} verdict={verdict} />
                            ))}
                        </SimpleGrid>
                    </Stack>
                </Paper>
            </Stack>
        </AdminLayout>
    );
}
