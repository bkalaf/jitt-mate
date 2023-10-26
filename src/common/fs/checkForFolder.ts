import * as fs from 'graceful-fs';
import path from 'path';

export function checkForFolder(folder: string) {
    if (!fs.existsSync(folder)) {
        const basename = path.dirname(folder);
        checkForFolder(basename);
        fs.mkdirSync(folder);
    }
}
