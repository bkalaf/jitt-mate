export function checkWS(s?: string) {
    return s == null ? undefined : s.length === 0 ? undefined : s;
}
