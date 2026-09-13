export default function IconChevronDown({
    size = 24,
    strokeWidth = 2,
    style,
}: {
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 9l6 6l6 -6" />
        </svg>
    );
}
