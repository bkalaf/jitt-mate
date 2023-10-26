export interface TopAdornments {
    zip: string;
    hood: string;
}

export type TopAdornmentsKey = keyof TopAdornments;

export const TopAdornments: EnumMap<TopAdornmentsKey> = {
    zip: 'full-zip',
    hood: 'hooded'
};
