import { enumColors } from './enumColors';

export const WaistTypesInfos = {
    'stretch-drawstring': { key: 'stretch & drawstring', color: enumColors.cyan2 },
    belted: { key: 'belted-waist', color: enumColors.lime2 },
    drawstring: { key: 'drawstring', color: enumColors.yellow2 },
    stretch: { key: 'stretch', color: enumColors.orange2 },
    semi: { key: 'semi-stretch', color: enumColors.rose2 }
};

export type WaistTypesKeys = keyof typeof WaistTypesInfos;
export const WaistTypesEnumMap = Object.fromEntries(Object.entries(WaistTypesInfos).map(([k, v]) => [k, v.key] as [WaistTypesKeys, string])) as Record<WaistTypesKeys, string>;
export const WaistTypesColorMap = Object.fromEntries(Object.entries(WaistTypesInfos).map(([k, v]) => [k, v.color] as [WaistTypesKeys, string])) as Record<WaistTypesKeys, string>;
