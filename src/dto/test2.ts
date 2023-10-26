import * as fs from 'graceful-fs';
import * as path from 'path';

const itemCondition = JSON.parse(fs.readFileSync(path.resolve('/home/bobby/Desktop/jitt/jitt/src/enums/colors.json')).toString());

console.log(JSON.stringify(itemCondition, null, '\t'))