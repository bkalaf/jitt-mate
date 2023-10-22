import { checkString } from './checkString';
import { writeBadData } from './writeBadData';

export function checkEnum<T extends string>(name: string, mapper: Record<string, string | null>, keys: string[]) {
    return function (value?: string) {
        return checkString(value, (s: string): [T | undefined, string | undefined] => {
            if (!keys.includes(s)) {
                console.error(`** IMPORTING ${name} FAILED** ${s} not found in possible values.`);
                writeBadData(name, value ?? '<undefined>');
                return [undefined, undefined];
            }
            return [value, mapper[s] ?? undefined] as [T, string];
        });
    };
}
