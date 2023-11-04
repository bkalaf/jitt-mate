export interface RnNumberTypes {
    rn: string;
    wpl: string;
}

export const RnNumberTypes = {
    rn: 'RN',
    wpl: 'WPL'
}

export type RnNumberTypesKey = keyof RnNumberTypes;