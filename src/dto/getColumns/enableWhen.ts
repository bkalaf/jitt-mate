
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enableWhen(name: string, equalThis: any, notEqual = false): IDependency {
    return ['enable', name, (x) => (notEqual ? x !== equalThis : x === equalThis)];
}
