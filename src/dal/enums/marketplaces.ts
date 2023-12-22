import { enumColors } from './sleeveTypes';

export const MarketplacesInfos = {
    ebay: { key: 'ebay.com', color: enumColors.yellow2 },
    mercari: { key: 'mercari.com', color: enumColors.sky2 },
    poshmark: { key: 'poshmark.com', color: enumColors.rose2 }
}

export const Marketplaces = Object.fromEntries(Object.entries(MarketplacesInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const MarketplacesColors = Object.fromEntries(Object.entries(MarketplacesInfos).map(([k, v]) => [k, v.color] as [string, string]));