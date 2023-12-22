import { enumColors } from './sleeveTypes';

export const ItemGroupsInfos = {
    apparel: { key: 'apparel', color: enumColors.sky2 },
    media: { key: 'media', color: enumColors.rose2 },
    bags: { key: 'bags', color: enumColors.purple2 },
    jewelry: { key: 'jewelry', color: enumColors.yellow2 }
};

export const ItemGroups = Object.fromEntries(Object.entries(ItemGroupsInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const ItemGroupsColors = Object.fromEntries(Object.entries(ItemGroupsInfos).map(([k, v]) => [k, v.color] as [string, string]));
