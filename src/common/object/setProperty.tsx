export function setProperty(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (obj: Record<string, any>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function (value: any) {
            if (!name.split('').includes('.')) {
                if (value != null) obj[name] = value;
                return obj;
            }
            const [n, ...remain] = name.split('.');
            const current = Object.getOwnPropertyNames(obj).includes(n) ? obj[n] : {};
            obj[n] = setProperty(remain.join('.'))(current)(value);
            return obj;
        };
    };
}

