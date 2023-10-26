export function normalizeStringForFS(replacement: string) {
    return function (str: string) {
        return [' ', "'", '"', ':', '.'].map((target) => (s: string) => s.replaceAll(target, replacement)).reduce((pv, cv) => cv(pv), str);
    };
}
