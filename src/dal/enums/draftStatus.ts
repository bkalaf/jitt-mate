import { enumColors } from './enumColors';

export const DraftStatusInfos = {
    doNotPost: { key: 'doNotPost', label: 'Do Not Post', color: enumColors.sky2 },
    inProgress: { key: 'inProgress', label: 'In Progress', color: enumColors.yellow2 },
    readyToPost: { key: 'readyToPost', label: 'Ready To Post', color: enumColors.orange2 },
    posted: { key: 'posted', label: 'Posted', color: enumColors.green2 }
}

export type DraftStatusKeys = keyof typeof DraftStatusInfos;
export const DraftStatusEnumMap = Object.fromEntries(Object.entries(DraftStatusInfos).map(([k, v]) => [k, v.key] as [DraftStatusKeys, string])) as Record<DraftStatusKeys, string>;
export const DraftStatusColorMap = Object.fromEntries(Object.entries(DraftStatusInfos).map(([k, v]) => [k, v.color] as [DraftStatusKeys, string])) as Record<DraftStatusKeys, string>;
export const DraftStatusLabelMap = Object.fromEntries(Object.entries(DraftStatusInfos).map(([k, v]) => [k, v.label] as [DraftStatusKeys, string])) as Record<DraftStatusKeys, string>;