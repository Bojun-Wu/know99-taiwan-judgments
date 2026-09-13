import { Verdict } from '@/types/verdict';
import { Link } from '@inertiajs/react';
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import classes from './VerdictCard.module.css';

export default function TrendingVerdictCard({ verdict }: { verdict: Verdict }) {
    return (
        <Card
            shadow="sm"
            radius="md"
            withBorder
            classNames={{ root: classes.card }}
            component={Link}
            href={route('verdicts.show', { verdict: verdict.verdictId })}
        >
            <Stack justify="space-between" h="100%">
                <Stack gap="xs">
                    <Title order={4} lineClamp={2}>
                        {verdict.title}
                    </Title>
                    <Text size="sm" c="dimmed" lineClamp={3}>
                        {verdict.summary ? `${verdict.summary.summary} 判決全文：${verdict.content}` : verdict.content}
                    </Text>
                    <Group mt="xs" gap={3}>
                        {verdict.keywords?.map((kw) => (
                            <Badge key={kw} color="cyan" variant="light" size="sm">
                                {kw}
                            </Badge>
                        ))}
                    </Group>
                </Stack>
                <Group justify="space-between" gap="xs">
                    <Text size="xs" c="dimmed">
                        {verdict.court?.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {verdict.judgementDate}
                    </Text>
                </Group>
            </Stack>
        </Card>
    );
}
