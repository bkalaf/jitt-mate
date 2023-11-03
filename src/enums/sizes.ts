import { GenderKeys, SizeKeys } from './importNecklineType';
import * as SizeMap from './all-sizes.json';
import { writeBadData } from './writeBadData';

export interface ISizeEntry {
    key: string;
    name: string;
    selector: string;
}

export type ApparelGroupKeys = string;
export type SizeEntries = Partial<Record<ApparelGroupKeys, Partial<Record<GenderKeys, Partial<Record<SizeKeys, ISizeEntry>>>>>>;

const sizeMap = SizeMap as SizeEntries;
