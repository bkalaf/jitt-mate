import { enumColors } from './enumColors';

export const RnNumberTypesInfos = {
    rn: { key: 'RN', color: enumColors.cyan2 },
    wpl: { key: 'WPL', color: enumColors.red2 },
}

export type RnNumberTypesKeys = keyof typeof RnNumberTypesInfos;
export const RnNumberTypesEnumMap = Object.fromEntries(Object.entries(RnNumberTypesInfos).map(([k, v]) => [k, v.key] as [RnNumberTypesKeys, string])) as Record<RnNumberTypesKeys, string>;
export const RnNumberTypesColorMap = Object.fromEntries(Object.entries(RnNumberTypesInfos).map(([k, v]) => [k, v.color] as [RnNumberTypesKeys, string])) as Record<RnNumberTypesKeys, string>;
