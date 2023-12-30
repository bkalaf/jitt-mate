import { enumColors } from './enumColors';

export const MarketplacesInfos = {
    ebay: { key: 'ebay.com', color: enumColors.yellow2 },
    mercari: { key: 'mercari.com', color: enumColors.sky2 },
    poshmark: { key: 'poshmark.com', color: enumColors.rose2 }
}

export type MarketplacesKeys = keyof typeof MarketplacesInfos;
export const MarketplacesEnumMap = Object.fromEntries(Object.entries(MarketplacesInfos).map(([k, v]) => [k, v.key] as [MarketplacesKeys, string])) as Record<MarketplacesKeys, string>;
export const MarketplacesColorMap = Object.fromEntries(Object.entries(MarketplacesInfos).map(([k, v]) => [k, v.color] as [MarketplacesKeys, string])) as Record<MarketplacesKeys, string>;
