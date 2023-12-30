import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as Config from '../../config.json';
import { useProvidedContext } from '../../hooks/useProvidedContext';
import * as fs from 'graceful-fs';

export type IAppConfigContext = {
    filename: string;
    config: typeof Config;
    setConfig: React.Dispatch<React.SetStateAction<typeof Config>>;
    writeFile: () => void;
};

export const AppConfigContext = createContext<IAppConfigContext | undefined>(undefined);
AppConfigContext.displayName = 'AppConfigContext';

export function useAppConfigContext() {
    return useProvidedContext(AppConfigContext);
}

export function useProvideAppConfigContext():IAppConfigContext {
    const filename = useMemo(() => ['/home/bobby/.config', 'jitt-mate', 'config', 'config.json'].join('/'), []);
    const [config, _setConfig] = useState(JSON.parse(fs.readFileSync(filename).toString()) as typeof Config);
    const setConfig = useCallback((prev: Parameters<React.Dispatch<React.SetStateAction<typeof Config>>>[0]) => {
        _setConfig(p => {
            if (typeof prev === 'function') {
                const r = prev(p);
                fs.writeFileSync(filename, JSON.stringify(r, null, '\t'));
                return r;
            }
            fs.writeFileSync(filename, JSON.stringify(prev, null, '\t'));
            return prev;
        })
    }, [filename])
    const writeFile = useCallback(() => {
        setConfig((prev) => {
            fs.writeFileSync(filename, JSON.stringify(prev, null, '\t'));
            return prev;
        })
    }, [filename, setConfig]);

    return {
        filename,
        config,
        setConfig,
        writeFile
    }
}

export function AppConfigProvider({ children }: { children?: Children }) {
    const value = useProvideAppConfigContext();
    return <AppConfigContext.Provider value={value}>
        {children}
    </AppConfigContext.Provider>
}

