import { IconInfoCircle } from '@/components/Icons/IconInfoCircle';
import Layout from '@/layouts/Layout';
import { Head } from '@inertiajs/react';
import { Anchor, Box, Container, Group, Paper, Stack, Table, Text, ThemeIcon, Title } from '@mantine/core';

const DATA_RANGE_TABLE = [
    { type: '司法院刑事補償法庭', range: '85年起之案件' },
    { type: '司法院訴願決定書', range: '91年10月起之案件' },
    { type: '最高法院', range: '39年起之案件' },
    { type: '最高行政法院', range: '87年起之案件' },
    { type: '公務員懲戒委員會', range: '85年起之案件' },
    { type: '臺灣高等法院訴願決定書', range: '95年起之案件' },
    { type: '臺灣高等法院及其分院', range: '89年起之案件' },
    { type: '高等行政法院', range: '89年7月起之案件' },
    { type: '地方法院', range: '90年起之案件' },
    { type: '簡易庭', range: '90年起之案件' },
    { type: '地方法院執行權判決', range: '89年起之案件' },
];

export default function About() {
    return (
        <Layout>
            <Head>
                <title>關於本站 - Know99判決書</title>
                <meta name="description" content="關於 Know99判決書：資料來源、收錄範圍、開發團隊。" />

                <meta name="robots" content="noindex, follow" />

                <meta property="og:title" content="關於本站 - Know99判決書" />
                <meta property="og:description" content="了解 Know99判決書的資料來源、收錄範圍與開發理念。" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://know99.com/about" />
                <meta property="og:site_name" content="Know99判決書" />
                <meta property="og:locale" content="zh_TW" />

                <meta httpEquiv="Content-Language" content="zh-TW" />
                <link rel="alternate" hrefLang="zh-TW" href="https://know99.com/about" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: '關於本站 - Know99判決書',
                        url: 'https://know99.com/about',
                        description: '了解 Know99判決書的資料來源、收錄範圍與開發理念。',
                        publisher: {
                            '@type': 'Organization',
                            name: 'Know99判決書',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://know99.com/favicon.ico',
                                width: 16,
                                height: 16,
                            },
                        },
                    })}
                </script>
            </Head>
            <Container size="lg" py="md">
                <Stack gap="3em">
                    <Paper radius="md" shadow="sm" p="xl" withBorder>
                        <Stack gap="xl">
                            <Group align="center" gap="xs">
                                <ThemeIcon variant="light" size={60} radius="md" visibleFrom="sm">
                                    <IconInfoCircle size={36} />
                                </ThemeIcon>
                                <Title order={1}>關於 Know99 判決書</Title>
                            </Group>
                            <Text c="dimmed" size="md">
                                Know99
                                判決書是一個由一群熱愛技術、關心法律資訊透明的獨立開發者打造的網站，致力於讓台灣的公開判決書更容易被搜尋、理解與應用。本站目前處於
                                Beta 測試階段，所有功能與資料仍在持續優化中，歡迎各種建議與回饋！
                            </Text>
                        </Stack>
                    </Paper>

                    <Paper radius="md" shadow="xs" p="xl" withBorder>
                        <Stack gap="md">
                            <Title order={3}>資料來源</Title>
                            <Text>
                                本站所有判決書資料均來自
                                <Anchor fw={500} href="https://opendata.judicial.gov.tw/" target="_blank">
                                    司法院資料開放平臺
                                </Anchor>
                                ，並依據司法院公告的資料範圍進行收錄與更新。
                            </Text>
                            <Text c="dimmed" size="sm" mt="xs">
                                <Anchor fw={500} href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0010053&flno=83" target="_blank">
                                    法院組織法第83條
                                </Anchor>
                                （各級法院及分院應定期出版公報或以其他適當方式，公開裁判書。但其他法律另有規定者，依其規定。）
                            </Text>
                        </Stack>
                    </Paper>

                    <Paper radius="md" shadow="xs" p="xl" withBorder>
                        <Stack gap="md">
                            <Title order={3}>資料範圍</Title>
                            <Stack gap="xs">
                                <Text mb="md">
                                    下表為各類型判決書的官方資料收錄起始時間。詳情請參閱
                                    <Anchor fw={500} href="https://judgment.judicial.gov.tw/readme.aspx" target="_blank">
                                        司法院裁判書系統資料開放範圍
                                    </Anchor>
                                    。
                                </Text>
                                <Text c="dimmed" size="sm">
                                    本站目前仍在測試階段，實際可查詢的資料可能少於下表資料收錄範圍，敬請見諒。
                                </Text>
                            </Stack>
                            <Box px={{ md: 'xl' }}>
                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>查詢類別</Table.Th>
                                            <Table.Th>資料收錄範圍</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {DATA_RANGE_TABLE.map((row) => (
                                            <Table.Tr key={row.type}>
                                                <Table.Td>{row.type}</Table.Td>
                                                <Table.Td>{row.range}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                        </Stack>
                    </Paper>
                    <Paper radius="md" shadow="xs" p="xl" withBorder>
                        <Stack gap="md">
                            <Title order={3}>關於本站</Title>
                            <Text>
                                本站僅供學術、研究與一般資訊查詢用途，所有資料以司法院官方公告為準，請勿作為正式法律依據。此外，判決書上公布之姓名/公司等，不宜進行過度解讀與關連，姓名相仿並不意味相同之人，不得用來詆毀揣測他人云云，不當使用者自負法律責任
                            </Text>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </Layout>
    );
}
