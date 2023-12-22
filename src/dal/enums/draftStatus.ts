import { toProperFromCamel } from '../../common/text/toProperCase';
import { enumColors } from './sleeveTypes';

export const DraftStatusInfos = {
    doNotPost: { key: 'doNotPost', color: enumColors.sky2 },
    inProgress: { key: 'inProgress', color: enumColors.yellow2 },
    readyToPost: { key: 'readyToPost', color: enumColors.orange2 },
    posted: { key: 'posted', color: enumColors.green2 }
}

export const DraftStatus = Object.fromEntries(Object.entries(DraftStatusInfos).map(([k, v]) => [k, toProperFromCamel(v.key)] as [string, string]));
export const DraftStatusColors = Object.fromEntries(Object.entries(DraftStatusInfos).map(([k, v]) => [k, v.color] as [string, string]));