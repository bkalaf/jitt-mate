export function range(start: number, end: number): number[] {
    if (start === end) return [end];
    return [start, ...range(start + 1, end)];
}
