import { useLocalizedRoute } from '@/i18n/routes';
import { Organization, Person } from '@/types/verdict';
import { Link } from '@inertiajs/react';
import { Button, Text } from '@mantine/core';
import { useMemo } from 'react';
import { IconSearch } from '../Icons/IconSearch';

function keywordSpan(keyword: string, index: number, href: string) {
    return (
        <Button
            component={Link}
            href={href}
            key={`${keyword}-${index}`}
            variant="light"
            radius="xl"
            size="xs"
            rightSection={<IconSearch size={14} />}
            mx={3}
        >
            {keyword}
        </Button>
    );
}

interface Props {
    content: string;
    people?: Person[];
    organizations?: Organization[];
}

export default function TaggedContent({ content, people, organizations }: Props) {
    const localizedRoute = useLocalizedRoute();
    const taggedContent = useMemo(() => {
        // Create a map to store keywords and their corresponding type
        const keywordPatterns = new Map<string, RegExp>();

        // Process people keywords
        people?.forEach((person) => {
            const name = person.name;
            // Create pattern that matches the name with optional spaces/full-width spaces between characters
            const pattern = new RegExp(name.split('').join('[\\s　]*'), 'g');
            keywordPatterns.set(name, pattern);
        });

        // Process organization keywords
        organizations?.forEach((organization) => {
            const name = organization.name;
            const pattern = new RegExp(name.split('').join('[\\s　]*'), 'g');
            keywordPatterns.set(name, pattern);
        });

        // Sort keywords by length (longest first) to handle overlapping keywords
        const keywords = Array.from(keywordPatterns.keys()).sort((a, b) => b.length - a.length);

        // Process content segments
        let segments: (string | React.ReactNode)[] = [content];
        const keywordCounter = new Map<string, number>();

        keywords.forEach((keyword) => {
            const pattern = keywordPatterns.get(keyword)!;
            const newSegments: (string | React.ReactNode)[] = [];
            keywordCounter.set(keyword, 0);

            segments.forEach((segment) => {
                if (typeof segment !== 'string') {
                    newSegments.push(segment);
                    return;
                }

                const parts = segment.split(pattern);
                // 沒有匹配到關鍵詞，直接返回
                if (parts.length === 1) {
                    newSegments.push(segment);
                    return;
                }

                // 每兩個 part 之間插入關鍵詞
                const result = parts.reduce((acc: (string | React.ReactNode)[], part, index) => {
                    if (index === 0) return [part];
                    const count = keywordCounter.get(keyword)!;
                    keywordCounter.set(keyword, count + 1);
                    return [...acc, keywordSpan(keyword, count, localizedRoute('verdicts.search', { query: keyword })), part];
                }, []);

                newSegments.push(...result);
            });

            segments = newSegments;
        });

        return segments;
    }, [content, people, organizations, localizedRoute]);

    return (
        <Text style={{ whiteSpace: 'pre-wrap' }} lh={1.7}>
            {taggedContent}
        </Text>
    );
}
