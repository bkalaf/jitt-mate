import * as Config from '../../../config.json';
import * as fs from 'graceful-fs';
import { app } from '@electron/remote';
import { Barcode } from '../../../dto/collections/Barcode';

export function pullNextUPC(key: keyof typeof Config.barcodes['prefix']) {
    return function () {
        const configOutput = [app.getPath('appData'), 'jitt-mate', 'config', 'config.json'].join('/');
        const $config = JSON.parse(fs.readFileSync(configOutput).toString()) as typeof Config;
        const current = $config.barcodes.current[key];
        const { leading, group, itemFiller } = $config.barcodes.prefix[key];
        const next = current + 1;
        const expanded = [leading, group, next.toFixed(0).padStart(5, itemFiller)].join('').padStart(12, '0');
        const newConfig = { ...$config, barcodes: { ...$config.barcodes, current: { ...$config.barcodes.current, [key]: next } } };
        console.info(`pullNextUPC: current, next, expanded, newConfig`, current, next, expanded, newConfig);

        fs.writeFileSync(configOutput, JSON.stringify(newConfig, null, '\t'));
        return Barcode.ctorWithoutCheckdigit(expanded);
    };
}
