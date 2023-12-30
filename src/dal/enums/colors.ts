// ///<reference path="./../../global.d.ts" />
export const ColorsInfos = {
    black: {
        key: 'black',
        selector: 'itemColorId-1',
        color: 'bg-black text-white border-white',
        aliases: ['charcoal']
    },
    grey: {
        key: 'grey',
        color: 'bg-neutral-500 text-white bg-black',
        selector: 'itemColorId-2',
        aliases: ['gray']
    },
    white: {
        key: 'white',
        color: 'bg-white text-black border-black',
        selector: 'itemColorId-3',
        aliases: ['cream', 'eggshell']
    },
    beige: {
        key: 'beige',
        selector: 'itemColorId-4',
        color: 'bg-orange-300 text-white border-black',
        aliases: ['tan']
    },
    red: {
        key: 'red',
        selector: 'itemColorId-5',
        color: 'bg-red-500 text-white border-black',
        aliases: ['burgundy', 'rose', 'crimson', 'scarlet']
    },
    pink: {
        key: 'pink',
        selector: 'itemColorId-6',
        color: 'bg-pink-500 text-white border-black',
        aliases: ['magenta', 'fuchsia']
    },
    purple: {
        key: 'purple',
        selector: 'itemColorId-7',
        color: 'bg-purple-500 text-white border-black',
        aliases: ['violet']
    },
    blue: {
        key: 'blue',
        selector: 'itemColorId-8',
        color: 'bg-sky-500 text-white border-black',
        aliases: ['cyan', 'aqua', 'teal', 'navy', 'denim', 'light-blue']
    },
    green: {
        key: 'green',
        selector: 'itemColorId-9',
        color: 'bg-emerald-500 text-white border-black',
        aliases: ['lime', 'emerald', 'dark-green', 'forest-green', 'sea-green']
    },
    yellow: {
        key: 'yellow',
        selector: 'itemColorId-10',
        color: 'bg-yellow-500 text-black border-black',
        aliases: []
    },
    orange: {
        key: 'orange',
        selector: 'itemColorId-11',
        color: 'bg-orange-500 text-white border-black',
        aliases: ['amber', 'copper']
    },
    brown: {
        key: 'brown',
        color: 'bg-orange-800 text-white border-black',
        selector: 'itemColorId-12'
    },
    gold: {
        key: 'gold',
        selector: 'itemColorId-13',
        color: 'bg-yellow-700 text-white border-black',
        aliases: ['goldenrod']
    },
    silver: {
        key: 'silver',
        color: 'bg-neutral-800 text-white border-black',
        selector: 'itemColorId-14'
    }
};

export type CoreColorsKeys = keyof typeof ColorsInfos;

export const MainColorsSelectorsMap = Object.fromEntries(Object.entries(ColorsInfos).map(([k, v]) => [k, v.selector] as [CoreColorsKeys, string]));
export const AliasColorsMainColorMap = Object.fromEntries(
    Object.entries(ColorsInfos)
        .map(([k, v]) => [k, ...('aliases' in v ? v.aliases : [])].map((c) => [c, k] as [string, string]))
        .reduce((pv, cv) => [...pv, ...cv], [])
);
export const aliasesToSelectors = (x: string) => MainColorsSelectorsMap[AliasColorsMainColorMap[x]]

