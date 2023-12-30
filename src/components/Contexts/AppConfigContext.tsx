import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as Config from '../../config.json';
import { useProvidedContext } from '../../hooks/useProvidedContext';
import * as fs from 'graceful-fs';
import { Barcode } from '../../dto/collections/Barcode';
import { IBarcode } from '../../dal/types';

export type IAppConfigContext = {
    filename: string;
    config: typeof Config;
    setConfig: React.Dispatch<React.SetStateAction<typeof Config>>;
    writeFile: () => void;
    pullNextUPC: (key: keyof typeof Config.barcodes['prefix']) => IBarcode;
};

export const AppConfigContext = createContext<IAppConfigContext | undefined>(undefined);
AppConfigContext.displayName = 'AppConfigContext';

export function useAppConfigContext() {
    return useProvidedContext(AppConfigContext);
}

export function useProvideAppConfigContext(): IAppConfigContext {
    const filename = useMemo(() => ['/home/bobby/.config', 'jitt-mate', 'config', 'config.json'].join('/'), []);
    const [config, _setConfig] = useState(JSON.parse(fs.readFileSync(filename).toString()) as typeof Config);
    const setConfig = useCallback(
        (prev: Parameters<React.Dispatch<React.SetStateAction<typeof Config>>>[0]) => {
            _setConfig((p) => {
                if (typeof prev === 'function') {
                    const r = prev(p);
                    fs.writeFileSync(filename, JSON.stringify(r, null, '\t'));
                    return r;
                }
                fs.writeFileSync(filename, JSON.stringify(prev, null, '\t'));
                return prev;
            });
        },
        [filename]
    );
    const writeFile = useCallback(() => {
        setConfig((prev) => {
            fs.writeFileSync(filename, JSON.stringify(prev, null, '\t'));
            return prev;
        });
    }, [filename, setConfig]);
    const pullNextUPC = useCallback(
        (key: keyof typeof Config.barcodes['prefix']) => {
            const current = config.barcodes.current[key];
            const { leading, group, itemFiller } = config.barcodes.prefix[key];
            const next = current + 1;
            const expanded = [leading, group, next.toFixed(0).padStart(5, itemFiller)].join('').padStart(12, '0');
            const newConfig = (prev: typeof Config) => ({ ...prev, barcodes: { ...config.barcodes, current: { ...config.barcodes.current, [key]: next } } });
            console.info(`pullNextUPC: current, next, expanded, newConfig`, current, next, expanded);
            setConfig(newConfig);
            return Barcode.ctorWithoutCheckdigit(expanded) as IBarcode;
        },
        [config.barcodes, setConfig]
    );
    useEffect(() => {
        window.$$pullNextUPC = pullNextUPC as (key: string) => any;
    }, [pullNextUPC])
    return {
        filename,
        config,
        setConfig,
        writeFile,
        pullNextUPC
    };
}

export function AppConfigProvider({ children }: { children?: Children }) {
    const value = useProvideAppConfigContext();
    return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}
