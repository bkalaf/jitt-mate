import { enumColors } from './enumColors';

export const VideoTypesInfos = {
    F: { key: 'film', color: enumColors.rose2 },
    TV: { key: 'tv-show', color: enumColors.cyan2 },
    M: { key: 'music', color: enumColors.lime2 }
};

export type VideoTypesKeys = keyof typeof VideoTypesInfos;
export const VideoTypesEnumMap = Object.fromEntries(Object.entries(VideoTypesInfos).map(([k, v]) => [k, v.key] as [VideoTypesKeys, string])) as Record<VideoTypesKeys, string>;
export const VideoTypesColorMap = Object.fromEntries(Object.entries(VideoTypesInfos).map(([k, v]) => [k, v.color] as [VideoTypesKeys, string])) as Record<VideoTypesKeys, string>;
