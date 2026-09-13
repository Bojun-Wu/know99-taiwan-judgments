export function parseVerdictContent(content: string): string {
    // remove manual line breaks
    // remove sequential empty lines
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    let parsedContent = '';

    for (const [index, line] of lines.entries()) {
        if (
            /^[ ]{1,6}[^ ]+/.test(line) &&
            !['主  文', '主　　文', '事  實', '事    實', '理  由', '正本證明與原本無異', '書記官'].some((keyword) => line.includes(keyword))
        ) {
            parsedContent += line.trim();
        } else {
            parsedContent += '\n\n' + line;
        }
    }

    return parsedContent;
}
