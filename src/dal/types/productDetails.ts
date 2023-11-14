import { IFlagDictionary, IMeasurementDictionary, IRn } from '.';
import { BacklineTypes } from '../enums/backlineTypes';
import { CollarTypes } from '../enums/collarTypes';
import { CuffTypes } from '../enums/cuffTypes';
import { FrontTypes } from '../enums/frontTypes';
import { LegTypes } from '../enums/legTypes';
import { NecklineTypes } from '../enums/necklineTypes';
import { Sizes } from '../enums/sizes';
import { SleeveTypes } from '../enums/sleeveTypes';
import { TopAdornments } from '../enums/topAdornments';
import { WaistTypes } from '../enums/waistTypes';

export interface IMediaDetails {
    kind: 'media';
}
export interface IApparelDetails {
    kind: 'apparel';
    measurements: IMeasurementDictionary;
    rn: Optional<IRn>;
    clothingCare: DBList<string>;
    backlineType: Optional<keyof BacklineTypes>;
    collarType: Optional<keyof CollarTypes>;
    cuffType: Optional<keyof CuffTypes>;
    necklineType: Optional<keyof NecklineTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    frontType: Optional<keyof FrontTypes>;
    waistType: Optional<keyof WaistTypes>;
    sleeveType: Optional<keyof SleeveTypes>;
    pocketCount: Optional<number>;
    size: Optional<keyof typeof Sizes>;
    legType: Optional<keyof LegTypes>;
    flags: IFlagDictionary;
}

export function setMetaData(value: boolean) {
    return ()
}
export class Phylum {
    method1(test: string) {
        return;
    }
}