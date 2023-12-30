export const ChestFitTypesInfos = {
    R: {
        key: 'R',
        label: '(R)egular'
    },
    L: {
        key: 'L',
        label: '(L)ong'
    },
    S: {
        key: 'S',
        label: '(S)hort'
    }
};

export type ChestFitTypesKeys = keyof typeof ChestFitTypesInfos;
export const ChestFitTypesKeyLabelMap = Object.fromEntries(Object.entries(ChestFitTypesInfos).map(([k, v]) => [k, v.label] as [ChestFitTypesKeys, string])) as Record<ChestFitTypesKeys, string>;
