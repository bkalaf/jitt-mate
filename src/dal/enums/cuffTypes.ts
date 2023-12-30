import { enumColors } from './enumColors';

export const CuffTypesInfos = {
    'angle-cut': { key: 'angle-cut-cuff', color: enumColors.cyan2 },
    '1-button': { key: '1-button-cuff', color: enumColors.lime2 },
    '2-button': { key: '2-button-cuff', color: enumColors.yellow2 },
    rounded: { key: 'rounded-cuff', color: enumColors.orange2 },
    french: { key: 'french-cuff', color: enumColors.rose2 },
    neapolitan: { key: 'neopolitan-cuff', color: enumColors.slate2 }
};

export type CuffTypesKeys = keyof typeof CuffTypesInfos;
export const CuffTypesEnumMap = Object.fromEntries(Object.entries(CuffTypesInfos).map(([k, v]) => [k, v.key] as [CuffTypesKeys, string])) as Record<CuffTypesKeys, string>;
