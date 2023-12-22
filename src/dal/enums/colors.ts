// ///<reference path="./../../global.d.ts" />
export interface IColorInfo {
    name: string;
    aliases?: ColorInfo[];
    selector?: string;
    classes?: string;
}
export type ColorInfo = IColorInfo | string;

export const ColorsInfos = {
    black: {
        name: 'black',
        selector: 'itemColorId-1',
        classes: 'bg-black text-white border-white',
        aliases: ['charcoal']
    },
    grey: {
        name: 'grey',
        classes: 'bg-neutral-500 text-white bg-black',
        selector: 'itemColorId-2',
        aliases: ['gray']
    },
    white: {
        name: 'white',
        classes: 'bg-white text-black border-black',
        selector: 'itemColorId-3',
        aliases: ['cream', 'eggshell']
    },
    beige: {
        name: 'beige',
        selector: 'itemColorId-4',
        classes: 'bg-orange-300 text-white border-black',
        aliases: ['tan']
    },
    red: {
        name: 'red',
        selector: 'itemColorId-5',
        classes: 'bg-red-500 text-white border-black',
        aliases: ['burgundy', 'rose', 'crimson', 'scarlet']
    },
    pink: {
        name: 'pink',
        selector: 'itemColorId-6',
        classes: 'bg-pink-500 text-white border-black',
        aliases: ['magenta', 'fuchsia']
    },
    purple: {
        name: 'purple',
        selector: 'itemColorId-7',
        classes: 'bg-purple-500 text-white border-black',
        aliases: ['violet']
    },
    blue: {
        name: 'blue',
        selector: 'itemColorId-8',
        classes: 'bg-sky-500 text-white border-black',
        aliases: ['cyan', 'aqua', 'teal', 'navy', 'denim', 'light-blue']
    },
    green: {
        name: 'green',
        selector: 'itemColorId-9',
        classes: 'bg-emerald-500 text-white border-black',
        aliases: ['lime', 'emerald', 'dark-green', 'forest-green', 'sea-green']
    },
    yellow: {
        name: 'yellow',
        selector: 'itemColorId-10',
        classes: 'bg-yellow-500 text-black border-black',
        aliases: []
    },
    orange: {
        name: 'orange',
        selector: 'itemColorId-11',
        classes: 'bg-orange-500 text-white border-black',
        aliases: ['amber', 'copper']
    },
    brown: {
        name: 'brown',
        classes: 'bg-orange-800 text-white border-black',
        selector: 'itemColorId-12'
    },
    gold: {
        name: 'gold',
        selector: 'itemColorId-13',
        classes: 'bg-yellow-700 text-white border-black',
        aliases: ['goldenrod']
    },
    silver: {
        name: 'silver',
        classes: 'bg-neutral-800 text-white border-black',
        selector: 'itemColorId-14'
    }
};

export type MainColors = keyof typeof ColorsInfos;

export const ColorsSelectors = Object.fromEntries(Object.entries(ColorsInfos).map(([k, v]) => [k, v.selector] as [MainColors, string]));
export const aliasesToMainColors = Object.fromEntries(
    Object.entries(ColorsInfos)
        .map(([k, v]) => [k, ...('aliases' in v ? v.aliases : [])].map((c) => [c, k] as [string, string]))
        .reduce((pv, cv) => [...pv, ...cv], [])
);
export const aliasesToSelectors = (x: string) => ColorsSelectors[aliasesToMainColors[x]]
export const ColorsColors = Object.fromEntries(Object.entries(ColorsInfos).map(([k, v]) => [k, v.classes] as [MainColors, string]));
export const aliasesToColorClasses = (x: string) => ColorsColors[aliasesToMainColors[x]];
export const aliasesToColorMap = Object.fromEntries(Object.keys(aliasesToMainColors).map((k) => [k, aliasesToColorClasses(k)] as [string, string]));
// console.log(JSON.stringify($colorNameMap, null, '\t'));
// console.log(JSON.stringify($colorSelectorMap, null, '\t'));

// console.log(lookupColor('blue'))
// console.log(lookupColorSelector('navy'));

// Object.keys(linkedColor).map((x) => console.log(lookupColorSelector(x)));
