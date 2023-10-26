export function joinText(middle: string) {
    return (left: string) => (right: string) => [left, middle, right].join('');
}
