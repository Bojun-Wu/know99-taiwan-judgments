import { createTheme } from '@mantine/core';

export const theme = createTheme({
    /** Put your mantine theme override here */
    fontFamily: 'Noto Sans TC, sans-serif',
    components: {
        Anchor: {
            defaultProps: {
                underline: false,
            },
        },
        Image: {
            defaultProps: {
                // todo: 添加圖片 fallback
                fallbackSrc: 'https://placehold.co/600x400?text=Placeholder',
            },
        },
    },
    colors: {
        deepBlue: ['#ecefff', '#d5dafb', '#a9b1f1', '#7a87e9', '#5362e1', '#3a4bdd', '#2c40dc', '#1f32c4', '#182cb0', '#0a259c'],
    },
    primaryColor: 'deepBlue',
});
