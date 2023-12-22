import { enumColors } from './sleeveTypes';

export const GenderInfos = {
    mens: { key: 'mens', color: enumColors.sky2 },
    womens: { key: 'womens', color: enumColors.pink2 },
    boys: { key: 'boys', color: enumColors.cyan2 },
    girls: { key: 'girls', color: enumColors.amber2 },
    baby: { key: 'baby', color: enumColors.yellow2 },
    toddler: {key: 'toddler', color: enumColors.slate2 },
    unisex: {key: 'unisex', color: enumColors.purple2 }
}
// export const _Genders = {
//     mens: {
//         description: "Mens",
//         name: 'mens'
//     },
//     womens: {
//         description: "Womens",
//         name: 'womens'
//     },
//     boys: {
//         description: 'Boys',
//         name: 'boys'
//     },
//     girls: {
//         description: 'Girls',
//         name: 'girls'
//     },
//     baby: {
//         description: 'Baby',
//         name: 'baby'
//     },
//     toddler: {
//         description: 'Toddler',
//         name: 'toddler'
//     },
//     unisex: {
//         description: 'Unisex',
//         name: 'unisex'
//     }
// };

export const Genders = Object.fromEntries(Object.entries(GenderInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const GendersColors = Object.fromEntries(Object.entries(GenderInfos).map(([k, v]) => [k, v.color] as [string, string]));