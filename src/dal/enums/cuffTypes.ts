import { enumColors } from './sleeveTypes';

export const CuffTypesInfos = {
    'angle-cut': { key: 'angle-cut-cuff', color: enumColors.cyan2 },
    '1-button': { key: 'one-button-cuff', color: enumColors.lime2 },
    '2-button': { key: 'two-button-cuff', color: enumColors.yellow2 },
    rounded: { key: 'rounded-cuff', color: enumColors.orange2 },
    french: { key: 'french-cuff', color: enumColors.rose2 },
    neapolitan: { key: 'neopolitan-cuff', color: enumColors.slate2 }
};

export const CuffTypes = Object.fromEntries(Object.entries(CuffTypesInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const CuffTypesColors = Object.fromEntries(Object.entries(CuffTypesInfos).map(([k, v]) => [k, v.color] as [string, string]));