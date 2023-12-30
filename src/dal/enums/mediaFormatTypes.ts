import { enumColors } from './enumColors';

export const MediaFormatTypesInfos = {
    BluRay: { key: 'Blu-Ray', color: enumColors.cyan2 },
    VHS: { key: 'VHS', color: enumColors.rose2 },
    DVD: { key: 'DVD', color: enumColors.yellow2 },
    CD: { key: 'CD', color: enumColors.slate2 }
};

export type MediaFormatTypesKeys = keyof typeof MediaFormatTypesInfos;

