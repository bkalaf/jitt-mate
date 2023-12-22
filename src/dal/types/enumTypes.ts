import { ApparelTypes } from '../enums/apparelType';
import { BacklineTypes } from '../enums/backlineTypes';
import { BookTypes } from '../enums/bookTypes';
import { ChestFitAbbrevs } from '../enums/chestFitTypes';
import { CollarTypes } from '../enums/collarTypes';
import { CuffTypes } from '../enums/cuffTypes';
import { FrontTypes } from '../enums/frontTypes';
import { GameRatings } from '../enums/gameRating';
import { Genders } from '../enums/genders';
import { ItemGroups } from '../enums/itemGroups';
import { LegTypes } from '../enums/legTypes';
import { MediaTypes } from '../enums/mediaTypes';
import { MovieRatings } from '../enums/movieRating';
import { NecklineTypes } from '../enums/necklineTypes';
import { SleeveTypes } from '../enums/sleeveTypes';
import { TopAdornments } from '../enums/topAdornments';
import { VideoTypes } from '../enums/videoTypes';
import { WaistTypes } from '../enums/waistTypes';

export interface IApparelEnums {
    apparelType: Optional<keyof ApparelTypes>;
    backlineType: Optional<keyof BacklineTypes>;
    chestFitType: Optional<keyof typeof ChestFitAbbrevs>;
    collarType: Optional<keyof typeof CollarTypes>;
    cuffType: Optional<keyof typeof CuffTypes>;
    frontType: Optional<keyof typeof FrontTypes>;
    gender: Optional<keyof typeof Genders>;
    itemGroup: Optional<keyof typeof ItemGroups>;
    legType: Optional<keyof typeof LegTypes>;
    necklineType: Optional<keyof NecklineTypes>;
    size: Optional<string>;
    sleeveType: Optional<keyof typeof SleeveTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    waistType: Optional<keyof typeof WaistTypes>;
}
export interface IMediaEnums {
    bookType: Optional<keyof BookTypes>;
    mediaType: Optional<keyof MediaTypes>;
    videoType: Optional<keyof VideoTypes>;
    gameRating: Optional<keyof GameRatings>;
    movieRating: Optional<keyof MovieRatings>;
}
