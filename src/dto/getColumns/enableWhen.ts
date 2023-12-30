
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enableWhen<T>(name: string, equalThis: T | T[], notEqual = false): IDependency {
    return ['enable', name, (x: T) => (notEqual ? Array.isArray(equalThis) ? !equalThis.includes(x) : x !== equalThis : Array.isArray(equalThis) ? equalThis.includes(x) : x === equalThis)];
}

export function enableWhenNotNull(name: string) {
    return ['enable', name, (x: any) => x != null] as IDependency
}