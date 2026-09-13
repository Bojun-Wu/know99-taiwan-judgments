import { Verdict } from '@/types/verdict';
import { Link } from '@inertiajs/react';
import { Anchor, Badge, Card, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconCalendar } from '../Icons/IconCalendar';
import IconFileDescription from '../Icons/IconFileDescription';
import classes from './VerdictCard.module.css';

export default function VerdictCard({ verdict }: { verdict: Verdict }) {
    return (
        <Anchor component={Link} href={`/verdicts/${verdict.verdictId}`}>
            <Card withBorder shadow="sm" radius="md" p="md" mb="sm" classNames={{ root: classes.card }}>
                <Stack gap="xs">
                    <Group gap="xs">
                        <Badge color="deepBlue" size="sm">
                            {verdict.category}
                        </Badge>
                        <Badge color="cyan" size="sm">
                            {verdict.court?.name}
                        </Badge>
                    </Group>

                    <Title order={4} lineClamp={2}>
                        {verdict.title}
                    </Title>

                    <Text size="sm" c="dimmed" lineClamp={3}>
                        {verdict.content}
                    </Text>

                    <Flex direction={{ base: 'column', xs: 'row' }} gap={10}>
                        <Group gap="xs">
                            <IconCalendar size={16} />
                            <Text size="sm" c="dimmed">
                                {verdict.judgementDate}
                            </Text>
                        </Group>
                        <Group gap="xs">
                            <IconFileDescription size={16} />
                            <Text size="sm" c="dimmed">
                                {verdict.verdictId}
                            </Text>
                        </Group>
                    </Flex>
                </Stack>
            </Card>
        </Anchor>
    );
}
