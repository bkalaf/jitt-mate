import { enumColors } from './enumColors';

export const ItemGroupsInfos = {
    apparel: { key: 'apparel', color: enumColors.sky2 },
    media: { key: 'media', color: enumColors.rose2 },
    bags: { key: 'bags', color: enumColors.purple2 },
    jewelry: { key: 'jewelry', color: enumColors.yellow2 }
};

export type ItemGroupsKeys = keyof typeof ItemGroupsInfos;
export const ItemGroupsEnumMap = Object.fromEntries(Object.entries(ItemGroupsInfos).map(([k, v]) => [k, v.key] as [ItemGroupsKeys, string])) as Record<ItemGroupsKeys, string>;
export const ItemGroupsColorMap = Object.fromEntries(Object.entries(ItemGroupsInfos).map(([k, v]) => [k, v.color] as [ItemGroupsKeys, string])) as Record<ItemGroupsKeys, string>;

