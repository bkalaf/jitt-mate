export function normalizeNewLine(text: string) {
    return text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
}
