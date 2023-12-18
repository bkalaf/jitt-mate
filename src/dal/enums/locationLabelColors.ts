import { getAssoc, toEnumMap } from './locationTypes';
import { objectMap } from './objectMap';

export const _LocationLabelColors = {
    orange: { text: 'orange', color: 'bg-orange-700 text-white' },
    yellow: { text: 'yellow', color: 'bg-yellow-500 text-black' },
    white: { text: 'white', color: 'bg-neutral-200 text-black' },
    blue: { text: 'blue', color: 'bg-sky-700 text-white' },
    purple: { text: 'purple', color: 'bg-purple-500 text-white' },
    pink: { text: 'pink', color: 'bg-rose-600 text-white' },
    green: { text: 'green', color: 'bg-emerald-800 text-white' }
};
export const [LocationLabelColors, LocationLabelColorsColors] = toEnumMap(_LocationLabelColors)
export type LocationLabelColors = typeof LocationLabelColors;
export type LocationLabelColorsColors = typeof LocationLabelColorsColors; 
export type LocationLabelColorsKey = keyof LocationLabelColors;