import { LocationKinds } from './../../../dist/jitt/jitt/src/dal/enums/locationKinds.d';
import { enumColors } from './enumColors';

export const LocationKindsInfos = {
    'storage-tote': { color: enumColors.rose2, key: 'storage-tote' },
    square: { color: enumColors.orange2, key: 'square' },
    'half-square': { color: enumColors.yellow2, key: 'half-square' },
    'metro-rack': { color: enumColors.green2, key: 'metro-rack' },
    'metro-shelf': { color: enumColors.cyan2, key: 'metro-shelf' },
    area: { color: enumColors.fuchsia2, key: 'area' },
    'under-table': { color: enumColors.slate2, key: 'under-table' },
    'over-table': { color: enumColors.pink2, key: 'over-table' },
    closet: { color: enumColors.amber2, key: 'closet' },
    stack: { color: enumColors.lime2, key: 'stack' },
    box: { color: enumColors.teal2, key: 'box' },
    'dvd-bag': { color: enumColors.sky2, key: 'dvd-bag' },
    'vhs-bag': { color: enumColors.indigo2, key: 'vhs-bag' }
};

export type LocationKindsKeys = keyof typeof LocationKindsInfos;
export const LocationKindsEnumMap = Object.fromEntries(Object.entries(LocationKindsInfos).map(([k, v]) => [k, v.key] as [LocationKindsKeys, string])) as Record<LocationKindsKeys, string>;
export const LocationKindsColorMap = Object.fromEntries(Object.entries(LocationKindsInfos).map(([k, v]) => [k, v.color] as [LocationKindsKeys, string])) as Record<LocationKindsKeys, string>;
