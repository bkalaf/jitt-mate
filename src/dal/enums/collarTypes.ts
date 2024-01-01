import { enumColors } from './enumColors';

export const CollarTypesInfos = {
    'button-down': { key: 'button-down-collar', color: enumColors.cyan2 },
    classic: { key: 'classic-collar', color: enumColors.lime2 },
    spread: { key: 'spread-collar', color: enumColors.yellow2 },
    club: { key: 'club-collar', color: enumColors.orange2 },
    mandarin: { key: 'mandarin-collar', color: enumColors.rose2 },
    'wing-tip': { key: 'wing-tip-collar', color: enumColors.slate2 }
};

export type CollarTypesKeys = keyof typeof CollarTypesInfos;
export const CollarTypesEnumMap = Object.fromEntries(Object.entries(CollarTypesInfos).map(([k, v]) => [k, v.key] as [CollarTypesKeys, string])) as Record<CollarTypesKeys, string>  