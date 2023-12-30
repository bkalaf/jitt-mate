import { enumColors } from './enumColors';

export const SleeveTypesInfos = {
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

export type SleeveTypesKeys = keyof typeof SleeveTypesInfos;
export const SleeveTypesEnumMap = Object.fromEntries(Object.entries(SleeveTypesInfos).map(([k, v]) => [k, v.key] as [SleeveTypesKeys, string])) as Record<SleeveTypesKeys, string>;
export const SleeveTypesColorMap = Object.fromEntries(Object.entries(SleeveTypesInfos).map(([k, v]) => [k, v.color] as [SleeveTypesKeys, string])) as Record<SleeveTypesKeys, string>;
