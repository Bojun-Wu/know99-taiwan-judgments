interface IconAlertCircleProps extends React.ComponentPropsWithoutRef<'svg'> {
    size?: number | string;
}

export function IconAlertCircle({ size, style, ...others }: IconAlertCircleProps) {
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
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    );
}
