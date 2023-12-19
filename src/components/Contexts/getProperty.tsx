export function getProperty(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (obj?: Record<string, any>): any {
        if (!name.split('').includes('.')) {
            return obj == null ? undefined : Object.getOwnPropertyNames(obj).includes(name) ? obj[name] : undefined;
        }
        const [n, ...remain] = name.split('.');
        const current = obj == null ? undefined : Object.getOwnPropertyNames(obj).includes(n) ? obj[n] : undefined;
        return getProperty(remain.join('.'))(current);
    };
}
