import * as fs from 'graceful-fs';
const ROOT = '/home/bobby/Desktop/jitt/jitt';
import * as cp from 'child_process';

const pathToRunGrep = [ROOT, 'bin/runGrep.sh'].join('/');

function runGrep(text: string, fn: string) {
    const output = cp.execFileSync(pathToRunGrep, [text, fn]);
    // const output = cp.spawnSync('runGrep.sh', [text, fn], { cwd: [ROOT, 'bin'].join('/') });
    const msg = output.toString();
    console.log(msg);
}

runGrep('useCollectionRoute', 'testGrep');
