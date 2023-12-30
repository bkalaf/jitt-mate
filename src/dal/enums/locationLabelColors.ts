export const LocationLabelColorsInfos = {
    orange: { key: 'orange', color: 'bg-orange-700 text-white' },
    yellow: { key: 'yellow', color: 'bg-yellow-500 text-black' },
    white: { key: 'white', color: 'bg-neutral-200 text-black' },
    blue: { key: 'blue', color: 'bg-sky-700 text-white' },
    purple: { key: 'purple', color: 'bg-purple-500 text-white' },
    pink: { key: 'pink', color: 'bg-rose-600 text-white' },
    green: { key: 'green', color: 'bg-emerald-800 text-white' }
};

export type LocationLabelColorsKeys = keyof typeof LocationLabelColorsInfos;
export const LocationLabelColorsEnumMap = Object.fromEntries(Object.entries(LocationLabelColorsInfos).map(([k, v]) => [k, v.key] as [LocationLabelColorsKeys, string])) as Record<LocationLabelColorsKeys, string>;
export const LocationLabelColorsColorMap = Object.fromEntries(Object.entries(LocationLabelColorsInfos).map(([k, v]) => [k, v.color] as [LocationLabelColorsKeys, string])) as Record<LocationLabelColorsKeys, string>;
