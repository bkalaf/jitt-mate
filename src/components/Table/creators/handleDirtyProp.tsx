
export function handleDirtyProp(value: boolean | Record<string, any>, name?: string, ...parts: string[]): string[] {
    return typeof value === 'boolean' ? name == null ? [] : [[...parts, name].filter(x => x != null && x.length > 0).join('.')] : Object.entries(value).map(([k, v]) => handleDirtyProp(v, k, ...[...parts, name ?? ''])).reduce((pv, cv) => [...pv, ...cv], []);
}
