import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            padding={{ base: 1, xs: 'md' }}
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        >
            <AppShell.Header>
                <Header opened={opened} toggle={toggle} />
            </AppShell.Header>

            <AppShell.Navbar>
                <Navbar />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>

            <Footer />
        </AppShell>
    );
}
