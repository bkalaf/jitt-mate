import { enumColors } from './enumColors';

export const NecklineTypesInfos = {
    spaghetti: { key: 'spaghetti strap', color: enumColors.cyan2 },
    asymmetric: { key: 'asymmetric', color: enumColors.rose2 },
    boat: { key: 'boatneck', color: enumColors.yellow2 },
    collar: { key: 'collared', color: enumColors.orange2 },
    cowl: { key: 'cowl neck', color: enumColors.lime2 },
    crew: { key: 'crew neck', color: enumColors.indigo2 },
    halter: { key: 'halter', color: enumColors.slate2 },
    illusion: { key: 'illusion', color: enumColors.red2 },
    jewel: { key: 'jewel', color: enumColors.amber2 },
    keyhole: { key: 'keyhole', color: enumColors.green2 },
    ots: { key: 'off-the-shoulder', color: enumColors.sky2 },
    plunging: { key: 'plunging', color: enumColors.purple2 },
    queen: { key: 'queen anne', color: enumColors.neutral2 },
    low: { key: 'low-neck', color: enumColors.pink2 },
    scallop: { key: 'scallop', color: enumColors.blue2 },
    scoop: { key: 'scoop neck', color: enumColors.teal2 },
    semi: { key: 'semi-sweetheart', color: enumColors.fuchsia2 },
    square: { key: 'square', color: enumColors.cyan3 },
    strapless: { key: 'strapless', color: enumColors.rose3 },
    ss: { key: 'strapless sweetheart', color: enumColors.yellow3 },
    sweet: { key: 'sweetheart', color: enumColors.orange3 },
    surplice: { key: 'surplice', color: enumColors.lime3 },
    turtle: { key: 'turtleneck', color: enumColors.blue3 },
    v: { key: 'v-neck', color: enumColors.zinc2 }
};

export type NecklineTypesKeys = keyof typeof NecklineTypesInfos;
export const NecklineTypesEnumMap = Object.fromEntries(Object.entries(NecklineTypesInfos).map(([k, v]) => [k, v.key] as [NecklineTypesKeys, string])) as Record<NecklineTypesKeys, string>
