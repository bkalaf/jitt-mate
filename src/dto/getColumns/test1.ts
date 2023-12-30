// ///<reference path="./../../global.d.ts" />
// import { partitionBy } from '../../common/array/partitionBy';
// import { AuctionSitesInfos } from '../../dal/enums/auctionSites';
// import { ColorsInfos } from '../../dal/enums/colors';
// import { GameRatingsInfos } from '../../dal/enums/gameRating';
// import { GendersInfos } from '../../dal/enums/genders';
// import { ItemConditionsInfos } from '../../dal/enums/itemConditions';
// import { LocationKindsInfos } from '../../dal/enums/locationKinds';
// import { LocationLabelColorsInfos } from '../../dal/enums/locationLabelColors';
// import { LocationTypesInfos } from '../../dal/enums/locationTypes';
// import { MarketplacesInfos } from '../../dal/enums/marketplaces';
// import { MovieRatingsInfos } from '../../dal/enums/movieRating';
// import { RnNumberTypesInfos } from '../../dal/enums/rnNumberType';
// import { ShippingVersionsInfos } from '../../dal/enums/shippingVersions';
// import { Sizes } from '../../dal/enums/sizes';
// import { SizeGroupsKeys } from '../../enums/sizes';
// import * as fs from 'graceful-fs';
// import * as C from '/home/bobby/.config/jitt-mate/config/config.json';
// import { enumColors } from '../../dal/enums/enumColors';
// // console.log(JSON.stringify(Object.fromEntries(Object.entries(Countries).map(([key, text]) => [key, { key, text }])), null, '\t'));

// // console.log(JSON.stringify(Object.fromEntries(Object.entries(ProvincesInfos).map(([key, text]) => [key, { key, text }])), null, '\t'));

// const enums = {
//     color: Object.fromEntries(Object.entries(ColorsInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     auctionSite: Object.fromEntries(Object.entries(AuctionSitesInfos).map(([k, v]) => [k, { ...v, key: k }])),
//     gender: Object.fromEntries(Object.entries(GendersInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     gameRating: GameRatingsInfos,
//     itemCondition: ItemConditionsInfos,
//     locationKind: Object.fromEntries(Object.entries(LocationKindsInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     locationLabelColor: Object.fromEntries(Object.entries(LocationLabelColorsInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     locationType: Object.fromEntries(Object.entries(LocationTypesInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     marketplace: Object.fromEntries(Object.entries(MarketplacesInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     movieRating: Object.fromEntries(Object.entries(MovieRatingsInfos).map(([k, v]) => [k, { ...v, text: k }])),
//     rnNumberType: Object.fromEntries(Object.entries(RnNumberTypesInfos).map(([k, v]) => [k, { ...v, text: k }])),
// }
// const menLetter = () => {
//     const [hasLow, noLow] = partitionBy((x: {
//         sizingType: string, size: string, key: string, selector: string, index: number, text: string, low?: string, high?: string
//     }) => x.low != null)(
//         Object.values(Sizes)
//             .filter((x) => x.sizingType === 'men-letter')
//             .map((x) => {
//                 const [low, high] = x.text.includes('(') ? x.text.split('(')[1].replaceAll(')', '').split('-') : [undefined, undefined];
//                 return {
//                     ...x,
//                     low,
//                     high
//                 };
//             })
//     )
//     const sortedHasLow = hasLow.sort((a, b) => (parseInt(a.low ?? '100', 10) < parseInt(b.low ?? '100', 10) ? -1 : parseInt(a.low ?? '100', 10) > parseInt(b.low ?? '100', 10) ? 1 : 0));
//     const sortedNoLow = noLow.sort((a, b) => a.text.localeCompare(b.text));
//     return [...sortedHasLow, ...sortedNoLow]
// }
// const womenLetter = () => {
//     const [hasLow, noLow] = partitionBy((x: {
//         sizingType: string, size: string, key: string, selector: string, index: number, text: string, low?: string, high?: string
//     }) => x.low != null)(
//         Object.values(Sizes)
//             .filter((x) => x.sizingType === 'women-letter')
//             .map((x) => {
//                 const [low, high] = x.text.includes('(') ? x.text.split('(')[1].replaceAll(')', '').split('-') : [undefined, undefined];
//                 return {
//                     ...x,
//                     low,
//                     high
//                 };
//             })
//     )
//     const sortedHasLow = hasLow.sort((a, b) => (parseInt(a.low ?? '100', 10) < parseInt(b.low ?? '100', 10) ? -1 : parseInt(a.low ?? '100', 10) > parseInt(b.low ?? '100', 10) ? 1 : 0));
//     const sortedNoLow = noLow.sort((a, b) => a.text.localeCompare(b.text));
//     return [...sortedHasLow, ...sortedNoLow]
// }
// const sizeGroups: Record<SizeGroupsKeys, any> = {
//     'women-dresses': {},
//     'women-bust': Object.values(Sizes)
//         .filter((x) => x.sizingType === 'women-bust')
//         .sort((a, b) => a.text.localeCompare(b.text)),
//     youth: Object.values(Sizes)
//         .filter((x) => x.sizingType === 'youth')
//         .sort((a, b) => a.text.localeCompare(b.text)),
//     'women-footwear': Object.values(Sizes)
//         .filter((x) => x.sizingType === 'women-footwear')
//         .sort((a, b) => a.text.localeCompare(b.text)),
//     'men-footwear': Object.values(Sizes)
//         .filter((x) => x.sizingType === 'men-footwear')
//         .sort((a, b) => a.text.localeCompare(b.text)),
//     'men-suits': Object.values(Sizes)
//         .filter((x) => x.sizingType === 'men-suits')
//         .sort((a, b) => a.text.localeCompare(b.text)),
//     'men-letter': menLetter(),
//     'women-letter': womenLetter(),
//     inches: Object.values(Sizes)
//         .filter((x) => x.sizingType === 'inches')
//         .sort((a, b) => a.text.localeCompare(b.text))
// };
// const output = {
//     enums,
//     shipping: ShippingVersionsInfos,
//     sizes: Sizes,
//     sizeGroups: sizeGroups,
//     country: C.enums.country,
//     province: C.enums.province,
//     kingdom: Object.fromEntries(Object.entries(C.enums.kingdom).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.rose2 } : { ...v, color: enumColors.rose2 }])),    
//     genus: Object.fromEntries(Object.entries(C.enums.genus).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.yellow2 } : { ...v, color: enumColors.yellow2 }])),
//     family:  Object.fromEntries(Object.entries(C.enums.family).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.indigo2 } : { ...v, color: enumColors.indigo2 }])),
//     klass:  Object.fromEntries(Object.entries(C.enums.klass).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.lime2 } : { ...v, color: enumColors.lime2 }])),
//     order: Object.fromEntries(Object.entries(C.enums.order).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.orange2 } : { ...v, color: enumColors.orange2 }])),
//     // species:  Object.entries(C.enums.genus).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.yellow2 } : { ...v, color: enumColors.yellow2 }]),
//     phylum:  Object.fromEntries(Object.entries(C.enums.phylum).map(([k, v]) => [k, typeof v === 'string' ? { key: v, text: v, color: enumColors.cyan2 } : { ...v, color: enumColors.cyan2 }]))
// }
// console.log(
//     JSON.stringify(
//         output,
//         null,
//         '\t'
//     )
// );

// fs.writeFileSync('e.json', JSON.stringify(output, null, '\t'));