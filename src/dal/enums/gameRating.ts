import { enumColors } from './enumColors';

export const GameRatingsInfos = {
    'E10+': { key: 'E10+', text: 'Everyone 10+', color: enumColors.cyan2 },
    RP: { key: 'RP', text: 'Rating Pending', color: enumColors.rose2 },
    E: { key: 'E', text: 'Everyone', color: enumColors.yellow2 },
    T: { key: 'T', text: 'Teen', color: enumColors.purple2 },
    M: { key: 'M', text: 'Mature 17+', color: enumColors.orange2 },
    AO: { key: 'AO', text: 'Adults Only 18+', color: enumColors.zinc2 },
};

export type GameRatingsKeys = keyof typeof GameRatingsInfos;