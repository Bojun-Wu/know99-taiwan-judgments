interface IconFilterOffProps extends React.ComponentPropsWithoutRef<'svg'> {
    size?: number | string;
}

export function IconFilterOff({ size, style, ...others }: IconFilterOffProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: size, height: size, ...style }}
            {...others}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227" />
            <path d="M3 3l18 18" />
        </svg>
    );
}
