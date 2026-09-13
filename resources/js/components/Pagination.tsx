import { PaginationLinks, PaginationMeta } from '@/types';
import { Link } from '@inertiajs/react';
import { Center, Pagination as MantinePagination } from '@mantine/core';

interface Props {
    paginationMeta: PaginationMeta;
    paginationLinks: PaginationLinks;
}

export default function Pagination({ paginationMeta, paginationLinks }: Props) {
    // 將 laravel 提供的 paginationMeta 轉換成 urlMap，方便後續使用
    const urlMap = paginationMeta.links.reduce((acc, link) => {
        if (link.label === 'Next &raquo;' || link.label === '&laquo; Previous' || !link.url) return acc;
        acc.set(parseInt(link.label), link.url);
        return acc;
    }, new Map());

    return (
        <Center>
            <MantinePagination
                size="sm"
                value={paginationMeta.current_page}
                total={paginationMeta.last_page}
                // maximum siblings is 3
                siblings={1}
                // maximum boundaries is 2
                boundaries={1}
                getItemProps={(page) => ({
                    component: Link,
                    href: urlMap.get(page),
                    preserveState: true,
                })}
                getControlProps={(control) => {
                    if (control === 'next') {
                        return {
                            component: Link,
                            href: paginationLinks.next,
                            preserveState: true,
                        };
                    }
                    if (control === 'previous') {
                        return {
                            component: Link,
                            href: paginationLinks.prev,
                            preserveState: true,
                        };
                    }
                    return {};
                }}
            />
        </Center>
    );
}
