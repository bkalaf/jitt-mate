import { enumColors } from './enumColors';

export const RnNumberTypesInfos = {
    rn: { key: 'RN', color: enumColors.cyan2 },
    wpl: { key: 'WPL', color: enumColors.red2 },
}

export type RnNumberTypesKeys = keyof typeof RnNumberTypesInfos;
