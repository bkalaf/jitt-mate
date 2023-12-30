import { enumColors } from './enumColors';

export const BacklineTypesInfos = {
    open: { key: 'open-back', color: enumColors.cyan2 },
    u: { key: 'u-shape-back', color: enumColors.rose2 },
    v: { key: 'v-shape-back', color: enumColors.lime2 },
    bare: { key: 'bare-back', color: enumColors.orange2 },
    x: { key: 'x-cross-back', color: enumColors.yellow2 },
    bow: { key: 'bow-back', color: enumColors.purple2 },
    strappy: { key: 'strappy-back', color: enumColors.zinc2 }
};

export type BacklineTypesKeys = keyof typeof BacklineTypesInfos;
export const BacklineTypesEnumMap = Object.fromEntries(Object.entries(BacklineTypesInfos).map(([k, v]) => [k, v.key] as [BacklineTypesKeys, string])) as Record<BacklineTypesKeys, string>;
