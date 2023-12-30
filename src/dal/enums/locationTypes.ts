export const LocationTypesInfos = {
    fixture: { key: 'fixture', color: 'bg-indigo-600 text-white' },
    shelf: { key: 'shelf', color: 'bg-rose-600 text-white' },
    bin: { key: 'bin', color: 'bg-yellow-600 text-black' }
};

export type LocationTypesKeys = keyof typeof LocationTypesInfos;
export const LocationTypesEnumMap = Object.fromEntries(Object.entries(LocationTypesInfos).map(([k, v]) => [k, v.key] as [LocationTypesKeys, string])) as Record<LocationTypesKeys, string>;
export const LocationTypesColorMap = Object.fromEntries(Object.entries(LocationTypesInfos).map(([k, v]) => [k, v.color] as [LocationTypesKeys, string])) as Record<LocationTypesKeys, string>;
