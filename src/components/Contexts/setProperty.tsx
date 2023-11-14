export function setProperty(name: string) {
    return function (obj: Record<string, any>) {
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

export function getProperty(name: string) {
    return function (obj?: Record<string, any>): any {
        if (!name.split('').includes('.')) {
            return obj == null ? undefined : Object.getOwnPropertyNames(obj).includes(name) ? obj[name] : undefined;
        }
        const [n, ...remain] = name.split('.');
        const current = obj == null ? undefined : Object.getOwnPropertyNames(obj).includes(n) ? obj[n] : undefined;
        return getProperty(remain.join('.'))(current);
    };
}
