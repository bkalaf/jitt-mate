export function capitalize(str: string) {
    if (str == null || str.length === 0) return str;
    const [head, ...tail] = str;
    return [head.toUpperCase(), ...tail].join('');
}
export function decapitalize(str: string) {
    if (str == null || str.length === 0) return str;
    const [head, ...tail] = str;
    return [head.toLowerCase(), ...tail].join('');
}
