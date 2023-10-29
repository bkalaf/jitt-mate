
export interface SizingTypes {
   'cup-size': string;
   'chest-char': string;
   'shoe-size-men': string;
   'shoe-size-women': string;
   'letter-sizes': string;
   'age-months': string;
   'men-qualified-letter-sizes': string;
   'women-qualified-letter-sizes': string;
   'waist-inches': string;
   'dress-sizes': string;
}

export type SizingTypesKey = keyof SizingTypes;
export const SizingTypes: EnumMap<SizingTypesKey> = {
    'cup-size': 'cup-size',
    'chest-char': 'chest-char',
    'shoe-size-men': 'shoe-size-men',
    'shoe-size-women': 'shoe-size-women',
    'letter-sizes': 'letter-sizes',
    'age-months': 'age-months',
    'men-qualified-letter-sizes': 'men-qualified-letter-sizes',
    'women-qualified-letter-sizes': 'women-qualified-letter-sizes',
    'waist-inches': 'waist-inches',
    'dress-sizes': 'dress-sizes'
};