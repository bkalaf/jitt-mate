export interface TopAdornments {
    zip: string;
    hood: string;
}

export type TopAdornmentsKey = keyof TopAdornments;

export const TopAdornments = {
    zip: 'full-zip',
    hood: 'hooded'
};
