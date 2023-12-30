import { enumColors } from './enumColors';

export const VideoTypesInfos = {
    F: { key: 'film', color: enumColors.rose2 },
    TV: { key: 'tv-show', color: enumColors.cyan2 },
    M: { key: 'music', color: enumColors.lime2 }
};

export type VideoTypesKeys = keyof typeof VideoTypesInfos;