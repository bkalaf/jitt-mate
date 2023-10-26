import * as NecklineTypes from './necklines.json';
export type NecklineTypeKeys = keyof typeof NecklineTypes;
export const NecklineTypeKeys = Object.keys(NecklineTypes);
import * as Colors from './colors.json';
export type ColorKeys = keyof typeof Colors;
export const ColorKeys = Object.keys(Colors);
import * as Materials from './material.json';
export type MaterialKeys = keyof typeof Materials;
export const MaterialKeys = Object.keys(Materials);
import * as Countries from './countries.json';
export type OriginKeys = keyof typeof Countries;
export const OriginKeys = Object.keys(Countries);
import * as ApparelTypes from './apparel-type.json';
export type ApparelTypeKeys = keyof typeof ApparelTypes;
export const ApparelTypeKeys = Object.keys(ApparelTypes);
import * as SleeveTypes from './sleeve-type.json';
export type SleeveTypeKeys = keyof typeof SleeveTypes;
export const SleeveTypeKeys = Object.keys(SleeveTypes);
import * as Sizes from './sizes.json';
export type SizeKeys = keyof typeof Sizes;
export const SizeKeys = Object.keys(Sizes);
import * as AuctionSites from './auctionSite.json';
export type AuctionSiteKeys = keyof typeof AuctionSites;
export const AuctionSiteKeys = Object.keys(AuctionSites);
import * as Genders from './gender.json';
export type GenderKeys = keyof typeof Genders;
export const GenderKeys = Object.keys(Genders);
import * as BookTypes from './book-type.json';
export type BookTypeKeys = keyof typeof BookTypes;
export const BookTypeKeys = Object.keys(BookTypes);
import * as MovieRatings from './movie-rating.json';
export type MovieRatingKeys = keyof typeof MovieRatings;
export const MovieRatingKeys = Object.keys(MovieRatings);
import * as GameRatings from './game-rating.json';
export type GameRatingKeys = keyof typeof GameRatings;
export const GameRatingKeys = Object.keys(GameRatings);
import * as MediaTypes from './media-type.json';
export type MediaTypeKeys = keyof typeof MediaTypes;
export const MediaTypeKeys = Object.keys(MediaTypes);
import * as VideoTypes from './video-type.json';
export type VideoTypeKeys = keyof typeof VideoTypes;
export const VideoTypeKeys = Object.keys(VideoTypes);
import * as BacklineTypes from './backlines.json';
export type BacklineTypeKeys = keyof typeof BacklineTypes;
export const BacklineTypeKeys = Object.keys(BacklineTypes);
import * as LegTypes from './leg-type.json';
export type LegTypeKeys = keyof typeof LegTypes;
export const LegTypeKeys = Object.keys(LegTypes);
import * as WaistTypes from './waist-type.json';
export type WaistTypeKeys = keyof typeof WaistTypes;
export const WaistTypeKeys = Object.keys(WaistTypes);
import * as CollarTypes from './collar-type.json';
export type CollarTypeKeys = keyof typeof CollarTypes;
export const CollarTypeKeys = Object.keys(CollarTypes);
import * as CuffTypes from './cuff-type.json';
export type CuffTypeKeys = keyof typeof CuffTypes;
export const CuffTypeKeys = Object.keys(CuffTypes);
import * as TopAdornments from './top-adornment.json';
export type TopAdornmentKeys = keyof typeof TopAdornments;
export const TopAdornmentKeys = Object.keys(TopAdornments);
import * as ItemGroups from './item-group.json';
export type ItemGroupKeys = keyof typeof ItemGroups;
export const ItemGroupKeys = Object.keys(ItemGroups);
import * as PaginationSize from './../enums/pagination-size.json';
export type PaginationSizeKeys = keyof typeof PaginationSize;
export const PaginationSizeKeys = Object.keys(PaginationSize);
import * as SizingTypes from './../enums/sizing-type.json';
import { checkEnum } from './checkEnum';
export type SizingTypeKeys = keyof typeof SizingTypes;
export const SizingTypeKeys = Object.keys(SizingTypes);


export const importNecklineTypes = checkEnum<NecklineTypeKeys>('neckline-type', NecklineTypes, NecklineTypeKeys);
export const importColors = checkEnum<ColorKeys>('colors', Colors, ColorKeys);
export const importMaterials = checkEnum<MaterialKeys>('materials', Materials, MaterialKeys);
export const importOrigin = checkEnum<OriginKeys>('origin', Countries, OriginKeys);
export const importApparelType = checkEnum<ApparelTypeKeys>('apparel-type', ApparelTypes, ApparelTypeKeys);
export const importSleeveType = checkEnum<SleeveTypeKeys>('sleeve-type', SleeveTypes, SleeveTypeKeys);
export const importSize = checkEnum<SizeKeys>(
    'size',
    Object.fromEntries((Object.entries(Sizes) as [string, { selector: string | null; name: string; }][]).map(([k, { selector, name }]) => [k, name])),
    SizeKeys
);
export const importSizeSelector = checkEnum<SizeKeys>(
    'size',
    Object.fromEntries((Object.entries(Sizes) as [string, { selector: string | null; name: string; }][]).map(([k, { selector, name }]) => [k, selector])),
    SizeKeys
);
export const importAuctionSite = checkEnum('auction-site', AuctionSites, AuctionSiteKeys);
export const importGender = checkEnum('gender', Genders, GenderKeys);
export const importBookType = checkEnum('book-type', BookTypes, BookTypeKeys);
export const importMovieRating = checkEnum('movie-rating', MovieRatings, MovieRatingKeys);
export const importGameRating = checkEnum('game-rating', GameRatings, GameRatingKeys);
export const importMediaType = checkEnum('media-type', MediaTypes, MediaTypeKeys);
export const importVideoType = checkEnum('video-type', VideoTypes, VideoTypeKeys);
export const importBacklineType = checkEnum<BacklineTypeKeys>('backlines-type', BacklineTypes, BacklineTypeKeys);
export const importLegType = checkEnum<LegTypeKeys>('leg-types', LegTypes, LegTypeKeys);
export const importWaistType = checkEnum<WaistTypeKeys>('waist-type', WaistTypes, WaistTypeKeys);
export const importCuffType = checkEnum<CuffTypeKeys>('cuff-type', CuffTypes, CuffTypeKeys);
export const importCollarType = checkEnum<CollarTypeKeys>('collar-type', CollarTypes, CollarTypeKeys);
export const importTopAdornments = checkEnum<TopAdornmentKeys>('top-adornments', TopAdornments, TopAdornmentKeys);
export const importItemGroups = checkEnum('ItemGroups', ItemGroups, ItemGroupKeys);
export const importSizingType = checkEnum('SizingType', SizingTypes, SizingTypeKeys);

const importEnum = {
    necklineTypes: importNecklineTypes,
    colors: importColors,
    materials: importMaterials,
    countries: importOrigin,
    apparelType: importApparelType,
    auctionSite: importAuctionSite,
    gender: importGender,
    bookType: importBookType,
    movieRating: importMovieRating,
    gameRating: importGameRating,
    mediaType: importMediaType,
    videoType: importVideoType,
    backlineType: importBacklineType,
    legType: importLegType,
    waistType: importWaistType,
    cuffType: importCuffType,
    collarType: importCollarType,
    topAdornment: importTopAdornments,
    itemGroup: importItemGroups,
    sleeveType: importSleeveType,
    size: importSize,
    sizingType: importSizingType
    // paginationSize: importPaginationSizeKeys
};

export {
    NecklineTypes,
    Colors,
    Materials,
    Countries,
    ApparelTypes,
    AuctionSites,
    Genders,
    SleeveTypes,
    BookTypes,
    MovieRatings,
    GameRatings,
    MediaTypes,
    VideoTypes,
    BacklineTypes,
    LegTypes,
    WaistTypes,
    CuffTypes,
    CollarTypes,
    TopAdornments,
    ItemGroups,
    importEnum,
    PaginationSize,
    SizingTypes
};
