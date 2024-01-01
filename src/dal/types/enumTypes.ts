import { SizeGroupsKeys } from '../../enums/sizes';
import { ApparelTypesKeys } from '../enums/apparelType';
import { BacklineTypesKeys } from '../enums/backlineTypes';
import { BookTypesKeys } from '../enums/bookTypes';
import { ChestFitTypesKeys } from '../enums/chestFitTypes';
import { CollarTypesKeys } from '../enums/collarTypes';
import { CuffTypesKeys } from '../enums/cuffTypes';
import { FrontTypesKeys } from '../enums/frontTypes';
import { GameRatingsKeys } from '../enums/gameRating';
import { GendersKeys } from '../enums/genders';
import { ItemGroupsKeys } from '../enums/itemGroups';
import { LegTypesKeys } from '../enums/legTypes';
import { MediaFormatTypesKeys } from '../enums/mediaFormatTypes';
import { MovieRatingsKeys } from '../enums/movieRating';
import { NecklineTypesKeys } from '../enums/necklineTypes';
import { SleeveTypesKeys } from '../enums/sleeveTypes';
import { TopAdornmentsKeys } from '../enums/topAdornments';
import { VideoTypesKeys } from '../enums/videoTypes';
import { WaistTypesKeys } from '../enums/waistTypes';

export interface IApparelEnums {
    // discriminator: 'apparel';
    apparelType: Optional<ApparelTypesKeys>;
    backlineType: Optional<BacklineTypesKeys>;
    chestFitType: Optional<ChestFitTypesKeys>;
    collarType: Optional<CollarTypesKeys>;
    cuffType: Optional<CuffTypesKeys>;
    frontType: Optional<FrontTypesKeys>;
    gender: Optional<GendersKeys>;
    legType: Optional<LegTypesKeys>;
    necklineType: Optional<NecklineTypesKeys>;
    size: Optional<string>;
    sizeGroup: Optional<SizeGroupsKeys>;
    sleeveType: Optional<SleeveTypesKeys>;
    topAdornment: Optional<TopAdornmentsKeys>;
    waistType: Optional<WaistTypesKeys>;
}
export interface IMediaEnums {
    // discriminator: 'media';
    bookType: Optional<BookTypesKeys>;
    mediaFormatType: Optional<MediaFormatTypesKeys>;
    videoType: Optional<VideoTypesKeys>;
    gameRating: Optional<GameRatingsKeys>;
    movieRating: Optional<MovieRatingsKeys>;
}
export interface IDecorEnums {
    holiday: Optional<string>;
    readonly effectiveHoliday: Optional<string>;
}
export interface IBatteryPowered {
    qty: number;
    batteryType: string;
}

export interface IHomeEnums {
    batteries: OptionalEntity<IBatteryPowered>;
    testedOn: Optional<Date>;
}