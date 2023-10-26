import * as Colors from './../enums/colors.json';
import { ApparelTypes, BacklineTypes, CollarTypes, Countries, CuffTypes, GameRatings, Genders, ItemGroups, LegTypes, MediaTypes, MovieRatings, NecklineTypes, SleeveTypes, TopAdornments, VideoTypes, WaistTypes } from '../enums/importNecklineType';
import { ISku } from './types';
import { createAttribute } from './createAttribute';
import * as ColorSelectors from '../enums/colors-selectors.json';
import { convertInches } from '../common/text/convertInches';
import { sizeName } from './Sku';

export const $Attr = (sku: ISku) => ({
    gender: createAttribute('gender', '$gender', Genders),
    itemGroup: createAttribute('itemGroup', '$itemGroup', ItemGroups),
    apparelType: createAttribute('apparelType', '$apparelType', ApparelTypes),
    sleeveType: createAttribute('sleeveType', '$sleeveType', SleeveTypes),
    collarType: createAttribute('collarType', '$collarType', CollarTypes),
    cuffType: createAttribute('cuffType', '$cuffType', CuffTypes),
    legType: createAttribute('legType', '$legType', LegTypes),
    waistType: createAttribute('waistType', '$waistType', WaistTypes),
    size: createAttribute('size', 'size', undefined, sizeName(sku.$sizeMap), 'id'),
    topAdornment: createAttribute('topAdornment', '$topAdornment', TopAdornments),
    necklineType: createAttribute('necklineType', '$necklineType', NecklineTypes),
    backlineType: createAttribute('backlineType', '$backlineType', BacklineTypes),
    origin: createAttribute('origin', '$origin', Countries),
    color: createAttribute('color', 'color', Colors, ColorSelectors, 'id'),
    videoType: createAttribute('videoType', '$videoType', VideoTypes),
    mediaType: createAttribute('mediaType', '$mediaType', MediaTypes),
    movieRating: createAttribute('movieRating', '$movieRating', MovieRatings),
    videoGameRating: createAttribute('videoGameRating', '$videoGameRating', GameRatings),
    circa: createAttribute('circa', '$circa'),
    length: createAttribute('length', '$length', undefined, undefined, undefined, convertInches),
    width: createAttribute('width', '$width', undefined, undefined, undefined, convertInches),
    height: createAttribute('height', '$height', undefined, undefined, undefined, convertInches),
    waistMeasurement: createAttribute('waistMeasurement', '$waistMeasurement', undefined, undefined, undefined, convertInches),
    sleeveMeasurement: createAttribute('sleeveMeasurement', '$sleeveMeasurement', undefined, undefined, undefined, convertInches)
});
