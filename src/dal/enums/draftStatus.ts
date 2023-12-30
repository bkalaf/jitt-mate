import { enumColors } from './enumColors';

export const DraftStatusInfos = {
    doNotPost: { key: 'doNotPost', label: 'Do Not Post', color: enumColors.sky2 },
    inProgress: { key: 'inProgress', label: 'In Progress', color: enumColors.yellow2 },
    readyToPost: { key: 'readyToPost', label: 'Ready To Post', color: enumColors.orange2 },
    posted: { key: 'posted', label: 'Posted', color: enumColors.green2 }
}

export type DraftStatusKeys = keyof typeof DraftStatusInfos;