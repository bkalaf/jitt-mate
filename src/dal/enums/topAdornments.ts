import { enumColors } from './enumColors';

export const TopAdornmentsInfos = {
    zip: { key: 'full-zip', color: enumColors.sky2 },
    hood: { key: 'hooded', color: enumColors.rose2 }
};

export type TopAdornmentsKeys = keyof typeof TopAdornmentsInfos;
export const TopAdornmentsEnumMap = Object.fromEntries(Object.entries(TopAdornmentsInfos).map(([k, v]) => [k, v.key] as [TopAdornmentsKeys, string])) as Record<TopAdornmentsKeys, string>;
export const TopAdornmentsColorMap = Object.fromEntries(Object.entries(TopAdornmentsInfos).map(([k, v]) => [k, v.color] as [TopAdornmentsKeys, string])) as Record<TopAdornmentsKeys, string>;
