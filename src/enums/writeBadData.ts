import * as fs from 'graceful-fs';
import * as Config from './../config.json';


export function writeBadData(...fields: string[]) {
    const data = [new Date(Date.now()).toLocaleString(), 'not found in possible values', ...fields].join('|').concat('\n');
    fs.appendFileSync(Config.badDataOutput, data);
}
