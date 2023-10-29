export interface Genders {
    M: string;
    F: string;
    B: string;
    G: string;
    I: string;
    T: string;
    U: string;
}
export type GendersKey = keyof Genders;

export const Genders: Genders = {
    M: "Men's",
    F: "Women's",
    B: "Boys'",
    G: "Girls'",
    I: 'Infant',
    T: 'Toddler',
    U: 'Unisex'
};


