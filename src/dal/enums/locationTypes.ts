export const LocationTypesInfos = {
    fixture: { key: 'fixture', color: 'bg-indigo-600 text-white' },
    shelf: { key: 'shelf', color: 'bg-rose-600 text-white' },
    bin: { key: 'bin', color: 'bg-yellow-600 text-black' }
};

export type LocationTypesKeys = keyof typeof LocationTypesInfos;
