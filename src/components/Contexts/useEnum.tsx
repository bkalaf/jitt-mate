import { useCallback, useMemo } from 'react';
import * as Config from '../../config.json';
import { enumColors } from '../../dal/enums/enumColors';
import { kebabToProperCase } from '../Table/metas/kebabToProperCase';
import { useAppConfigContext } from './AppConfigContext';


export function useEnum(type: string) {
    const { config, setConfig } = useAppConfigContext();
    const { sizes, ...rest } = config.enums;
    const enums = rest as Record<string, Record<string, { key: string; text: string; color?: string; selector?: string; aliases?: string[]; }>>;
    const $enum = useMemo(() => enums[type] ?? {}, [enums, type]);
    const aliasMap = useMemo(
        () => Object.fromEntries(
            Object.entries($enum)
                .map(([k, v]) => [k, ...(v.aliases ?? [])].map((k2) => [k2, k2 === v.key ? v : { ...v, text: kebabToProperCase(k2) }] as [string, { key: string; text: string; color: keyof typeof enumColors; selector?: string; }]))
                .reduce((pv, cv) => [...pv, ...cv], [])
        ),
        [$enum]
    );
    const enumMap = useMemo(() => Object.fromEntries(Object.entries(aliasMap).map(([k, v]) => [k, v.text] as [string, string])), [aliasMap]);
    const colorMap = useMemo(() => Object.fromEntries(Object.entries(aliasMap).map(([k, v]) => [k, v.color] as [string, string])), [aliasMap]);
    const selectorMap = useMemo(() => Object.fromEntries(Object.entries(aliasMap).map(([k, v]) => [k, v.selector] as [string, string])), [aliasMap]);
    const checkUniqueValues = useCallback((map: Map<string, number>) => {
        const missing = Array.from(map.entries())
            .filter((x) => x[0] != null)
            .filter(([k]) => !Object.keys(aliasMap).includes(k));
        console.log(`missing`, map, missing);
        setConfig(prev => {
            if (missing.length === 0) return prev;
            const $missing = Object.fromEntries(missing.map(t => t[0]).map((k) => [k, k] as [string, string]));
            return { ...prev, enums: { ...enums, [type]: { ...$enum, ...$missing } } } as any as typeof Config;
        });
        const result = Array.from(map.entries()).map(tuple => tuple[0]).filter(x => x != null).map(x => x in enumMap ? { id: x, label: enumMap[x] ?? kebabToProperCase(x) } : { id: x, label: kebabToProperCase(x) }).sort((a, b) => a.label.localeCompare(b.label));
        console.log(`options`, result);
        return result;
    }, [$enum, aliasMap, enumMap, enums, setConfig, type]);

    return {
        aliasMap,
        enumMap,
        colorMap,
        selectorMap,
        checkUniqueValues
    };
}
