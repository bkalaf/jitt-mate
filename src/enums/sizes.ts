import { GenderKeys, SizeKeys } from './importNecklineType';
import * as ApparelGroupTypes from './apparel-group.json';
import * as SizeMap from './all-sizes.json';
import { writeBadData } from './writeBadData';

export const ApparelGroupKeys = Object.keys(ApparelGroupTypes);
export type ApparelGroupKeys = keyof typeof ApparelGroupTypes;

export interface ISizeEntry { key: string; name: string; selector: string; }

export type SizeEntries = Partial<Record<ApparelGroupKeys, Partial<Record<GenderKeys, Partial<Record<SizeKeys, ISizeEntry>>>>>>;


const sizeMap = SizeMap as SizeEntries;

export function importAllSizes(apparelGroup: ApparelGroupKeys, gender: GenderKeys) {
    return (value?: SizeKeys) => {
        if (value == null || value.length === 0) return undefined;
        const level1 = sizeMap[apparelGroup];
        const level2 = level1 == null ? undefined : level1[gender];
        const level3 = level2 == null ? undefined : level2[value];
        if (level3 == null) {
            const lvl = level1 == null ? 'level1' : level2 == null ? 'level2' : 'level3';
            const data = ['allSizes', apparelGroup, gender, value, lvl];
            writeBadData(...data);
        }
        return level3;
    }
}