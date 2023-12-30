import { enumColors } from '../dal/enums/enumColors';
import * as SizingMap from './Sizes.json';

export const SizeGroupsInfos = {
    'women-footwear': { key: 'women-footwear', color: enumColors.cyan2 },
    'men-letter': { key: 'men-letter', color: enumColors.rose2 },
    'women-letter': { key: 'women-letter', color: enumColors.yellow2 },
    inches: { key: 'inches', color: enumColors.orange2 },
    'women-dresses': { key: 'women-dresses', color: enumColors.lime2 },
    'men-suits': { key: 'men-suits', color: enumColors.purple2 },
    'men-footwear': { key: 'men-footwear', color: enumColors.slate2 },
    youth: { key: 'youth', color: enumColors.red2 },
    'women-bust': { key: 'women-bust', color: enumColors.fuchsia2 }
}

export type SizeGroupsKeys = keyof typeof SizeGroupsInfos;
export const SizeGroupsEnumMap = Object.fromEntries(Object.entries(SizeGroupsInfos).map(([k, v]) => [k, v.key] as [SizeGroupsKeys, string])) as Record<SizeGroupsKeys, string>;
export const SizeGroupsColorMap = Object.fromEntries(Object.entries(SizeGroupsInfos).map(([k, v]) => [k, v.color] as [SizeGroupsKeys, string])) as Record<SizeGroupsKeys, string>;

export const getSizes = (sizingGroup: SizeGroupsKeys) => sizingGroup in SizeMap ? SizingMap[sizingGroup] as Record<string, { name: string, key: string, selector: string }> : {};

export const SizesLabelMap = (sizingGroup: SizeGroupsKeys) => Object.fromEntries(Object.entries(getSizes(sizingGroup)).map(([k, v]) => [k, v.name] as [string, string]));
export const SizesSelectorMap = (sizingGroup: SizeGroupsKeys) => Object.fromEntries(Object.entries(getSizes(sizingGroup)).map(([k, v]) => [k, v.selector] as [string, string]));