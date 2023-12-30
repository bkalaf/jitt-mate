import { enumColors } from './enumColors';

export const GameRatingsInfos = {
    'E10+': { key: 'E10+', label: 'Everyone 10+', color: enumColors.cyan2 },
    RP: { key: 'RP', label: 'Rating Pending', color: enumColors.rose2 },
    E: { key: 'E', label: 'Everyone', color: enumColors.yellow2 },
    T: { key: 'T', label: 'Teen', color: enumColors.purple2 },
    M: { key: 'M', label: 'Mature 17+', color: enumColors.orange2 },
    AO: { key: 'AO', label: 'Adults Only 18+', color: enumColors.zinc2 },
};

export type GameRatingsKeys = keyof typeof GameRatingsInfos;
export const GameRatingsEnumMap = Object.fromEntries(Object.entries(GameRatingsInfos).map(([k, v]) => [k, v.key] as [GameRatingsKeys, string])) as Record<GameRatingsKeys, string>;
export const GameRatingsColorMap = Object.fromEntries(Object.entries(GameRatingsInfos).map(([k, v]) => [k, v.color] as [GameRatingsKeys, string])) as Record<GameRatingsKeys, string>;
export const GameRatingsLabelsMap = Object.fromEntries(Object.entries(GameRatingsInfos).map(([k, v]) => [k, v.label] as [GameRatingsKeys, string])) as Record<GameRatingsKeys, string>;