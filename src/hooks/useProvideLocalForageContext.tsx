import localforage from 'localforage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Config from '../config.json';
import { equalityCompare } from '../common/equalityCompare';
import { ILocalForageContext, SettingsConfig } from '../components/Contexts/LocalForageContext';
import { is } from '../dal/is';

export function useProvideLocalForageContext(): ILocalForageContext {
    const forager = useMemo(() => localforage.createInstance(Config.localForage), []);
    const [data, setData] = useState<Record<string, any>>({});
    const getDefaultValue = useCallback((key: keyof SettingsConfig) => {
        return (Config.settings as SettingsConfig)[key];
    }, []);
    const getValue = useCallback((key: 'page-size' | 'page-index' | 'max-page-index', coll?: string) => {
        return (): number => coll == null ? data[key] : data[key][coll];
    }, [data]);
    const setValue = useCallback(
        (key: 'page-size' | 'page-index' | 'max-page-index', coll?: string) => {
            return (value: number | Updater<number>) => setData((prev) => {
                const v = coll == null ? prev[key] : prev[key][coll]
                const handle = is.func<Updater<number>>(value) ? value(v) : value;
                if (value === handle) return prev;
                if (coll == null) return { ...prev, [key]: handle }
                return { ...prev, [key]: { ...prev[key], [coll]: handle } };
            });
        },
        []
    );
    useEffect(() => {
        Object.entries(data)
            .map(([k, v]) => async () => {
                await forager.setItem(k, v);
            })
            .reduce(
                (pv, cv) => async () => {
                    await pv();
                    await cv();
                },
                () => Promise.resolve()
            )();
    }, [data, forager]);
    useEffect(() => {
        ['page-size', 'page-index', 'max-page-index']
            .map((x) => async () => {
                const value = await forager.getItem(x);
                setData((prev) => {
                    const current = prev[x];
                    if (equalityCompare(current, value)) {
                        return prev;
                    }
                    return { ...prev, [x]: value };
                });
            })
            .reduce(
                (pv, cv) => async () => {
                    await pv();
                    await cv();
                },
                () => Promise.resolve()
            )();
    }, [forager]);
    return {
        forager,
        getDefaultValue,
        getValue,
        setValue
    };
}
