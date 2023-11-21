import localforage from 'localforage';
import { useMemo } from 'react';
import Config from '../config.json';
import { ILocalForageContext } from '../components/Contexts/LocalForageContext';

export function useProvideLocalForageContext(): ILocalForageContext {
    const forager = useMemo(() => localforage.createInstance(Config.localForage), []);
    return {
        forager
    };
}
