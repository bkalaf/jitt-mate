// ///<reference path="./../../global.d.ts" />
import { convertToLookup } from './convertToLookup';
import { linkedColor } from './mercariColor';
import { unzip } from './unzip';

export interface IColorInfo {
    name: string;
    aliases?: ColorInfo[];
    selector?: string;
    bg?: string;
    text?: string;
    border?: string;
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
        aliases: ['charcoal']
    },
    grey: {
        name: 'grey',
        selector: 'itemColorId-2',
        aliases: ['gray']
    },
    white: {
        name: 'white',
        selector: 'itemColorId-3',
        aliases: ['cream', 'eggshell']
    },
    beige: {
        name: 'beige',
        selector: 'itemColorId-4',
        aliases: ['tan']
    },
    red: {
        name: 'red',
        selector: 'itemColorId-5',
        aliases: ['burgundy', 'rose', 'crimson', 'scarlet']
    },
    pink: {
        name: 'pink',
        selector: 'itemColorId-6',
        aliases: ['magenta', 'fuchsia']
    },
    purple: {
        name: 'purple',
        selector: 'itemColorId-7',
        aliases: ['violet']
    },
    blue: {
        name: 'blue',
        selector: 'itemColorId-8',
        aliases: ['cyan', 'aqua', 'teal', 'navy', 'denim', 'light-blue']
    },
    green: {
        name: 'green',
        selector: 'itemColorId-9',
        aliases: ['lime', 'emerald', 'dark-green', 'forest-green', 'sea-green']
    },
    yellow: {
        name: 'yellow',
        selector: 'itemColorId-10',
        aliases: []
    },
    orange: {
        name: 'orange',
        selector: 'itemColorId-11',
        aliases: ['amber', 'copper']
    },
    brown: {
        name: 'brown',
        selector: 'itemColorId-12'
    },
    gold: {
        name: 'gold',
        selector: 'itemColorId-13',
        aliases: ['goldenrod']
    },
    silver: {
        name: 'silver',
        selector: 'itemColorId-14'
    }
};

const [colorNameMap, colorSelectorMap] = unzip(
    Object.entries(Colors).map(([k, v]) => {
        const { name, aliases, selector } = { ...(typeof v === 'string' ? { name: v } : { ...v }) };
        const mapped = [
            [
                { key: name, value: name },
                { key: name, value: selector ?? '' }
            ],
            ...(aliases ?? []).map(
                (a) =>
                    [
                        { key: a, value: name },
                        { key: a, value: selector }
                    ] as [{ key: string; value: string }, { key: string; value: string }]
            )
        ] as [{ key: string; value: string }, { key: string; value: string }][];
        const [m, n] = unzip(mapped);
        // console.log(JSON.stringify(m, null, '\t'));
        // console.log(JSON.stringify(n, null, '\t'));
        return [m, n] as [{ key: string; value: string }[], { key: string; value: string }[]];
        // const [colorNameMap, colorSelectorMap] = unzip(mapped);
        // return [colorNameMap, colorSelectorMap];
    })
);
const $colorNameMap = Object.fromEntries(colorNameMap.reduce((pv, cv) => [...pv, ...cv], []).map(({ key, value }) => [key, value] as [keyof typeof Colors, string]));
const $colorSelectorMap = Object.fromEntries(colorSelectorMap.reduce((pv, cv) => [...pv, ...cv], []).map(({ key, value }) => [key, value] as [string, string]));

// console.log(JSON.stringify($colorNameMap, null, '\t'));
// console.log(JSON.stringify($colorSelectorMap, null, '\t'));

export const lookupColor = convertToLookup($colorNameMap);
export const lookupColorSelector = convertToLookup($colorSelectorMap);

// console.log(lookupColor('blue'))
// console.log(lookupColorSelector('navy'));

// Object.keys(linkedColor).map((x) => console.log(lookupColorSelector(x)));