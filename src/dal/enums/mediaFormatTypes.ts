import { enumColors } from './enumColors';

export const MediaFormatTypesInfos = {
    BluRay: { key: 'Blu-Ray', color: enumColors.cyan2 },
    VHS: { key: 'VHS', color: enumColors.rose2 },
    DVD: { key: 'DVD', color: enumColors.yellow2 },
    CD: { key: 'CD', color: enumColors.slate2 }
};

export type MediaFormatTypesKeys = keyof typeof MediaFormatTypesInfos;
export const MediaFormatTypesEnumMap = Object.fromEntries(Object.entries(MediaFormatTypesInfos).map(([k, v]) => [k, v.key] as [MediaFormatTypesKeys, string])) as Record<MediaFormatTypesKeys, string>;
export const MediaFormatTypesColorMap = Object.fromEntries(Object.entries(MediaFormatTypesInfos).map(([k, v]) => [k, v.color] as [MediaFormatTypesKeys, string])) as Record<
    MediaFormatTypesKeys,
    string
>;
