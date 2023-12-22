import { enumColors } from './sleeveTypes';

export const CollarTypesInfos = {
    'button-down': { key: 'button-down-collar', color: enumColors.cyan2 },
    classic: { key: 'classic-collar', color: enumColors.lime2 },
    spread: { key: 'spread-collar', color: enumColors.yellow2 },
    club: { key: 'club-collar', color: enumColors.orange2 },
    mandarin: { key: 'mandarin-collar', color: enumColors.rose2 },
    'wing-tip': { key: 'wing-tip-collar', color: enumColors.slate2 }
};


export const CollarTypes = Object.fromEntries(Object.entries(CollarTypesInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const CollarTypesColors = Object.fromEntries(Object.entries(CollarTypesInfos).map(([k, v]) => [k, v.color] as [string, string]));