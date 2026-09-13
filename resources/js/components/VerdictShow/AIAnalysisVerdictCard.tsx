import { Verdict } from '@/types/verdict';
import { Link } from '@inertiajs/react';
import { ActionIcon, Button, Card, Center, Grid, Group, Loader, Stack, Text, ThemeIcon, Title, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { IconAlertCircle } from '../Icons/IconAlertCircle';
import IconRobot from '../Icons/IconRobot';
import { IconSearch } from '../Icons/IconSearch';
import IconSparkles from '../Icons/IconSparkles';
import IconThumbDown from '../Icons/IconThumbDown';
import IconThumbUp from '../Icons/IconThumbUp';

interface Props {
    verdict: Verdict;
}

export default function AIAnalysisVerdictCard({ verdict }: Props) {
    const [verdictData, setVerdictData] = useState<Verdict>(verdict);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [lastVoted, setLastVoted] = useLocalStorage<Date | null>({
        key: `summary-${verdictData.summary?.id}-voted`,
        defaultValue: null,
    });
    const allowVoteClick = !!lastVoted ? dayjs(lastVoted).isBefore(dayjs().subtract(1, 'day')) : true;

    const fetchAIAnalysisVerdict = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            console.log('fetching AI analysis verdict');
            const response = await axios.get(route('verdicts.ai-analysis', { verdict: verdict.verdictId }));
            
            // Check if AI analysis was blocked
            if (response.data.ai_analysis_blocked) {
                setError('AI 分析暫時無法使用，請稍後再試');
                return;
            }
            
            setVerdictData(response.data.verdict);
        } catch (error) {
            console.error(error);
            setError('AI 摘要生成失敗，請稍後再試');
        } finally {
            console.log('fetching AI analysis verdict done');
            setIsLoading(false);
        }
    }, [verdict.verdictId]);

    useEffect(() => {
        if (!verdictData.summary) fetchAIAnalysisVerdict();
    }, []);

    const handleVote = async (type: 'upvote' | 'downvote') => {
        notifications.show({
            title: '感謝您的建議',
            message: type === 'upvote' ? 'AI 摘要系統將會更準確' : 'AI 摘要系統將持續優化',
            color: 'green',
            position: 'top-right',
        });
        try {
            if (verdictData.summary?.id && allowVoteClick) {
                console.log('voting', verdictData.summary.id, type);
                setLastVoted(dayjs().toDate());
                await axios.post(route(`verdicts.ai-analysis.${type}`, { summary: verdictData.summary.id }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const hasEntities = (verdictData.people && verdictData.people.length > 0) || (verdictData.organizations && verdictData.organizations.length > 0);

    return (
        <Card shadow="sm" radius="md" withBorder>
            <Card.Section p="xs" withBorder>
                <Group justify="space-between">
                    <Group gap={3}>
                        <ThemeIcon variant="transparent">
                            <IconSparkles size={20} />
                        </ThemeIcon>
                        <Title order={5} fw={500}>
                            AI 智能分析
                        </Title>
                    </Group>
                    <Group>
                        {!isLoading && error && (
                            <Button variant="light" size="sm" onClick={fetchAIAnalysisVerdict} leftSection={<IconRobot size={16} />}>
                                重新生成
                            </Button>
                        )}
                    </Group>
                </Group>
            </Card.Section>

            <Card.Section p={{ base: 'sm', md: 'md' }}>
                {isLoading ? (
                    <Center py="xl">
                        <Loader color="deepBlue" type="bars" />
                    </Center>
                ) : error ? (
                    <Center py="xl">
                        <Text c="dimmed">{error}😶😶</Text>
                    </Center>
                ) : (
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, sm: hasEntities ? 6 : 12 }}>
                            <Stack gap="xs">
                                <Text size="sm" c="dimmed" fw={500}>
                                    摘要
                                </Text>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{verdictData.summary?.summary}</Text>
                            </Stack>
                        </Grid.Col>

                        {hasEntities && (
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Stack gap="xs">
                                    {verdictData.people && verdictData.people.length > 0 && (
                                        <>
                                            <Text size="sm" c="dimmed" fw={500}>
                                                提及人名
                                            </Text>
                                            <Group gap="xs" wrap="wrap">
                                                {verdictData.people.map((person) => (
                                                    <Button
                                                        key={person.id}
                                                        component={Link}
                                                        href={`/search?query=${person.name}`}
                                                        variant="light"
                                                        radius="xl"
                                                        size="xs"
                                                        rightSection={<IconSearch size={14} />}
                                                    >
                                                        {person.name}
                                                    </Button>
                                                ))}
                                            </Group>
                                        </>
                                    )}

                                    {verdictData.organizations && verdictData.organizations.length > 0 && (
                                        <>
                                            <Text size="sm" c="dimmed" fw={500}>
                                                相關組織
                                            </Text>
                                            <Group gap="xs" wrap="wrap">
                                                {verdictData.organizations.map((org) => (
                                                    <Button
                                                        key={org.id}
                                                        component={Link}
                                                        href={`/search?query=${org.name}`}
                                                        variant="light"
                                                        radius="xl"
                                                        size="xs"
                                                        rightSection={<IconSearch size={14} />}
                                                    >
                                                        {org.name}
                                                    </Button>
                                                ))}
                                            </Group>
                                        </>
                                    )}
                                </Stack>
                            </Grid.Col>
                        )}
                    </Grid>
                )}
            </Card.Section>

            {verdictData.summary && (
                <Card.Section p={{ base: 'sm', md: 'md' }} pt={{ base: 'sm', md: 0 }}>
                    <Group justify="space-between">
                        <Group gap="xs">
                            <IconAlertCircle size={16} style={{ color: '#868e96' }} />
                            <Text size="xs" c="dimmed">
                                AI 摘要可能會發生錯誤。請查核重要資訊。
                            </Text>
                        </Group>
                        <Group gap="xs" visibleFrom="xs">
                            <Tooltip label={allowVoteClick ? '這則摘要有幫助' : '建議已經送出，請稍後再試'}>
                                <ActionIcon
                                    variant="subtle"
                                    color={allowVoteClick ? 'deepBlue' : 'gray'}
                                    onClick={() => handleVote('upvote')}
                                    disabled={!allowVoteClick}
                                >
                                    <IconThumbUp size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label={allowVoteClick ? '這則摘要沒有幫助' : '建議已經送出，請稍後再試'}>
                                <ActionIcon
                                    variant="subtle"
                                    color={allowVoteClick ? 'red' : 'gray'}
                                    onClick={() => handleVote('downvote')}
                                    disabled={!allowVoteClick}
                                >
                                    <IconThumbDown size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Card.Section>
            )}
        </Card>
    );
}
