// ///<reference path="./../../global.d.ts" />
import { convertToLookup } from './convertToLookup';
import { linkedColor } from './mercariColor';
import { unzip } from './unzip';

export interface IColorInfo {
    name: string;
    aliases?: ColorInfo[];
    selector?: string;
    classes?: string;
}
export type ColorInfo = IColorInfo | string;
export interface Colors {
    black: ColorInfo;
    grey: ColorInfo;
    white: ColorInfo;
    beige: ColorInfo;
    red: ColorInfo;
    pink: ColorInfo;
    purple: ColorInfo;
    blue: ColorInfo;
    green: ColorInfo;
    yellow: ColorInfo;
    orange: ColorInfo;
    brown: ColorInfo;
    gold: ColorInfo;
    silver: ColorInfo;
}
export type ColorsKey = keyof Colors;

export const Colors: Record<ColorsKey, ColorInfo> = {
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

type ColorInfoItem = { key: string; value: string };

function buildColorInfoMaps() {
    const colors = Object.entries(Colors);
    const colors2 = colors.map(([k, v]) => ({ ...(typeof v === 'string' ? { name: v } : v)}));
    const { toClasses, toName, toSelector } = colors2.map(({ name, classes, aliases, selector }) => [...aliases as string[] ?? [], name].map(n => ({
        toName: [name, n] as [string, string],
        toClasses: [n, classes] as [string, string],
        toSelector: [n, selector] as [string, string]
    })).reduce(({ toClasses: pvToClasses, toSelector: pvToSelector, toName: pvToName }, { toClasses: cvToClasses, toSelector: cvToSelector, toName: cvToName }) => {
        return {
            toClasses: [...pvToClasses, cvToClasses],
            toSelector: [...pvToSelector, cvToSelector],
            toName: [...pvToName, cvToName]
        }
    }, { toClasses: [] as [string, string][], toSelector: [] as [string, string][], toName: [] as [string, string][]})).reduce(({ toClasses: pvToClasses, toSelector: pvToSelector, toName: pvToName }, { toClasses: cvToClasses, toSelector: cvToSelector, toName: cvToName }) => {
        return {
            toClasses: [...pvToClasses, ...cvToClasses],
            toName: [...pvToName, ...cvToName],
            toSelector: [...pvToSelector, ...cvToSelector]
        }
    }, { toClasses: [], toSelector: [], toName: [] });
    return {
        colorToName: Object.fromEntries(toName),
        colorToClasses: Object.fromEntries(toClasses),
        colorToSelector: Object.fromEntries(toSelector)
    }
}

export const { colorToClasses, colorToName, colorToSelector } = buildColorInfoMaps();

// console.log(JSON.stringify($colorNameMap, null, '\t'));
// console.log(JSON.stringify($colorSelectorMap, null, '\t'));

// console.log(lookupColor('blue'))
// console.log(lookupColorSelector('navy'));

// Object.keys(linkedColor).map((x) => console.log(lookupColorSelector(x)));
