import * as fs from 'graceful-fs';
import path from 'path';

export function checkForFolder(folder: string) {
    console.warn(`checkForFolder: ${folder}`)
    if (!fs.existsSync(folder)) {
        const basename = path.dirname(folder);
        console.warn(`checkForFolder-recurse, ${basename}`);
        checkForFolder(basename);
        fs.mkdirSync(folder);
    }
}
