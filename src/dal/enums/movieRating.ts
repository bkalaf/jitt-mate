import { enumColors } from './enumColors';
export const MovieRatingsInfos = {
    PG13: { key: 'PG-13', color: enumColors.cyan2 },
    G: { key: 'G', color: enumColors.rose2 },
    PG: { key: 'PG', color: enumColors.green2 },
    R: { key: 'R', color: enumColors.yellow2 },
    X: { key: 'X', color: enumColors.orange2 },
    NR: { key: 'NR', color: enumColors.purple2 },
};

export type MovieRatingsKeys = keyof typeof MovieRatingsInfos;
export const MovieRatingsEnumMap = Object.fromEntries(Object.entries(MovieRatingsInfos).map(([k, v]) => [k, v.key] as [MovieRatingsKeys, string])) as Record<MovieRatingsKeys, string>;
export const MovieRatingsColorMap = Object.fromEntries(Object.entries(MovieRatingsInfos).map(([k, v]) => [k, v.color] as [MovieRatingsKeys, string])) as Record<MovieRatingsKeys, string>;
