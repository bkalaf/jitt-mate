import { enumColors } from './enumColors';

export const ItemGroupsInfos = {
    apparel: { key: 'apparel', color: enumColors.sky2 },
    media: { key: 'media', color: enumColors.rose2 },
    bags: { key: 'bags', color: enumColors.purple2 },
    jewelry: { key: 'jewelry', color: enumColors.yellow2 }
};

export type ItemGroupsKeys = keyof typeof ItemGroupsInfos;
