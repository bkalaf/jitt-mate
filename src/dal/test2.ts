import * as fs from 'graceful-fs';
import * as path from 'path';
import { capitalize } from '../common/text/capitalize';

const toRun = [
    'auctionSite',
    'backlines',
    'book-type',
    'game-rating',
    'cuff-type',
    'countries',
    'collar-type',
    'item-condition',
    'material',
    'media-type',
    'shipping',
    'movie-rating',
    'necklines',
    'video-type',
    'waist-type'
];

export const mercariColor = {
    black: 'itemColorId-1',
    grey: 'itemColorId-2',
    white: 'itemColorId-3',
    beige: 'itemColorId-4',
    red: 'itemColorId-5',
    pink: 'itemColorId-6',
    purple: 'itemColorId-7',
    blue: 'itemColorId-8',
    green: 'itemColorId-9',
    yellow: 'itemColorId-10',
    orange: 'itemColorId-11',
    brown: 'itemColorId-12',
    gold: 'itemColorId-13',
    silver: 'itemColorId-14'
};

console.log(JSON.stringify(mercariColor, null, '\t'));
// fs.writeFileSync('/home/bobby/Desktop/jitt/jitt/src/itemColors.ts', toRun.map(run).join('\n'));


// const run = (arg: string) => {
//     const json = JSON.parse(fs.readFileSync(path.resolve(`/home/bobby/Desktop/jitt/jitt/src/enums/${arg}.json`)).toString());
//     const name = arg.replaceAll('-', ' ').split(' ').map(capitalize).join('');
//     const keys = Object.getOwnPropertyNames(json);
//     const intf = `export interface ${name} {\n`.concat(
//         keys
//             .map((x) => {
//                 const qx = x.includes('-') ? `"${x}"` : x;
//                 return `${qx}: string;`;
//             }).join('\n')
//             .concat('}')
//     );
    
//     return [intf, `export const ${name} = `.concat(JSON.stringify(json, null, '\t'))].join('\n');
// };

// fs.writeFileSync('/home/bobby/Desktop/jitt/jitt/src/jsonOut.ts', toRun.map(run).join('\n'));
