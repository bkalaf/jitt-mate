import { useCallback } from 'react';
import { process } from '@electron/remote';
import * as fs from 'graceful-fs';

export type LogTypes = 'db' | 'error' | 'schema' | 'data' | 'defs' | 'view'

export function useLogger() {
    const writeProcess = useCallback((msg: string) => process.stdout.write(msg.concat('\n')), []);
    const writeFile = useCallback((msg: string, category: LogTypes = 'schema') => {
        const basePath = '/home/bobby/Desktop/jitt/jitt/logs/';
        const filename = [basePath, category, '.txt'].join('');
        if (category) {
            fs.appendFileSync(filename, [category, msg].join(' | ').concat('\n'));
        }
        writeProcess(msg);
        console.log(msg);
    }, [writeProcess]);
    return writeFile;
}

export function useLog(category: LogTypes) {
    const log = useLogger();
    return useCallback((...args: string[]) => {
        log(args.join('\n'), category)
    }, [category, log])
}