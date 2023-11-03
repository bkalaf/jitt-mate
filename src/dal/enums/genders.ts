export type GenderInfo = {
    name: string;
    description: string;
};
export interface Genders {
    M: GenderInfo;
    F: GenderInfo;
    B: GenderInfo;
    G: GenderInfo;
    I: GenderInfo;
    T: GenderInfo;
    U: GenderInfo;
}
export type GendersKey = keyof Genders;

export const Genders: Record<GendersKey, GenderInfo> = {
    M: {
        description: "Men's",
        name: 'mens'
    },
    F: {
        description: "Women's",
        name: 'womens'
    },
    B: {
        description: 'Boys',
        name: 'boys'
    },
    G: {
        description: 'Girls',
        name: 'girls'
    },
    I: {
        description: 'Baby',
        name: 'baby'
    },
    T: {
        description: 'Toddler',
        name: 'toddler'
    },
    U: {
        description: 'Unisex',
        name: 'unisex'
    }
};
