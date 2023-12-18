
export function disableWhen(name: string, equalThis: any, notEqual = false): IDependency {
    return ['disable', name, (x) => (notEqual ? x !== equalThis : x === equalThis)];
}
