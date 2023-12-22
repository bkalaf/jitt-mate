// export type SleeveTypes = {
//     batwing: string;
//     bell: string;
//     bishop: string;
//     bracelet: string;
//     butterfly: string;
//     button: string;
//     cape: string;
//     circular: string;
//     cowl: string;
//     drop: string;
//     french: string;
//     juliet: string;
//     kimono: string;
//     lantern: string;
//     layer: string;
//     less: string;
//     long: string;
//     marie: string;
//     mutton: string;
//     off: string;
//     peasant: string;
//     petal: string;
//     poet: string;
//     puffed: string;
//     raglan: string;
//     rollup: string;
//     shirt: string;
//     short: string;
//     quarter: string;
// };

export const enumColors = {
    teal1: 'bg-teal-300 text-black',
    teal2: 'bg-teal-600 text-white',
    teal3: 'bg-teal-900 text-white',

    indigo1: 'bg-indigo-300 text-black',
    indigo2: 'bg-indigo-600 text-white',
    indigo3: 'bg-indigo-900 text-white',

    lime1: 'bg-lime-300 text-black',
    lime2: 'bg-lime-600 text-white',
    lime3: 'bg-lime-900 text-white',

    rose1: 'bg-rose-300 text-black',
    rose2: 'bg-rose-600 text-white',
    rose3: 'bg-rose-900 text-white',

    amber1: 'bg-amber-300 text-black',
    amber2: 'bg-amber-600 text-white',
    amber3: 'bg-amber-900 text-white',

    sky1: 'bg-sky-300 text-black',
    sky2: 'bg-sky-600 text-white',
    sky3: 'bg-sky-900 text-white',

    yellow1: 'bg-yellow-300 text-black',
    yellow2: 'bg-yellow-600 text-white',
    yellow3: 'bg-yellow-900 text-white',

    fuchsia1: 'bg-fuchsia-300 text-black',
    fuchsia2: 'bg-fuchsia-600 text-white',
    fuchsia3: 'bg-fuchsia-900 text-white',

    orange1: 'bg-orange-300 text-black',
    orange2: 'bg-orange-600 text-white',
    orange3: 'bg-orange-900 text-white',

    red1: 'bg-red-300 text-black',
    red2: 'bg-red-600 text-white',
    red3: 'bg-red-900 text-white',

    blue1: 'bg-blue-300 text-black',
    blue2: 'bg-blue-600 text-white',
    blue3: 'bg-blue-900 text-white',

    green1: 'bg-green-300 text-black',
    green2: 'bg-green-600 text-white',
    green3: 'bg-green-900 text-white',

    cyan1: 'bg-cyan-300 text-black',
    cyan2: 'bg-cyan-600 text-white',
    cyan3: 'bg-cyan-900 text-white',

    pink1: 'bg-pink-300 text-black',
    pink2: 'bg-pink-600 text-white',
    pink3: 'bg-pink-900 text-white',

    slate1: 'bg-slate-300 text-black',
    slate2: 'bg-slate-600 text-white',
    slate3: 'bg-slate-900 text-white',
    purple1: 'bg-purple-300 text-black',
    purple2: 'bg-purple-600 text-white',
    purple3: 'bg-purple-900 text-white'
};
export const SleeveTypeInfos = {
    batwing: { key: 'batwing', color: enumColors.teal1 },
    bell: { key: 'bell', color: enumColors.teal2 },
    bishop: { key: 'bishop', color: enumColors.teal3 },
    bracelet: { key: 'bracelet', color: enumColors.lime1 },
    butterfly: { key: 'butterfly', color: enumColors.lime2 },
    circular: { key: 'circular-cap', color: enumColors.lime3 },
    button: { key: 'button-tab', color: enumColors.rose1 },
    cape: { key: 'cape', color: enumColors.rose2 },
    cowl: { key: 'cowl', color: enumColors.rose3 },
    drop: { key: 'drop-shoulder', color: enumColors.yellow1 },
    french: { key: 'french', color: enumColors.yellow2 },
    juliet: { key: 'juliet', color: enumColors.yellow3 },
    kimono: { key: 'kimono', color: enumColors.orange1 },
    lantern: { key: 'lantern', color: enumColors.orange2 },
    layer: { key: 'layered', color: enumColors.orange3 },
    less: { key: 'sleeveless', color: enumColors.purple1 },
    long: { key: 'long-sleeved', color: enumColors.purple2 },
    marie: { key: 'marie', color: enumColors.purple3 },
    mutton: { key: 'leg-of-mutton', color: enumColors.red1 },
    off: { key: 'off-shoulder', color: enumColors.red2 },
    peasant: { key: 'peasant', color: enumColors.red3 },
    petal: { key: 'petal', color: enumColors.slate1 },
    poet: { key: 'poet', color: enumColors.slate2 },
    puffed: { key: 'puffed', color: enumColors.slate3 },
    raglan: { key: 'raglan', color: enumColors.amber1 },
    rollup: { key: 'roll-up', color: enumColors.amber2 },
    shirt: { key: 'cuffed', color: enumColors.amber3 },
    short: { key: 'short-sleeved', color: enumColors.cyan1 },
    quarter: { key: '3/4-sleeve', color: enumColors.cyan2 }
};

export const SleeveTypes = Object.fromEntries(Object.entries(SleeveTypeInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const SleeveTypesColors = Object.fromEntries(Object.entries(SleeveTypeInfos).map(([k, v]) => [k, v.color] as [string, string]));