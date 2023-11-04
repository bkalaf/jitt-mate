export type GenderInfo = {
    name: string;
    description: string;
};
export interface Genders {
    mens: GenderInfo;
    womens: GenderInfo;
    boys: GenderInfo;
    girls: GenderInfo;
    baby: GenderInfo;
    toddler: GenderInfo;
    unisex: GenderInfo;
}
export type GendersKey = keyof Genders;

export const Genders: Record<GendersKey, GenderInfo> = {
    mens: {
        description: "Mens",
        name: 'mens'
    },
    womens: {
        description: "Womens",
        name: 'womens'
    },
    boys: {
        description: 'Boys',
        name: 'boys'
    },
    girls: {
        description: 'Girls',
        name: 'girls'
    },
    baby: {
        description: 'Baby',
        name: 'baby'
    },
    toddler: {
        description: 'Toddler',
        name: 'toddler'
    },
    unisex: {
        description: 'Unisex',
        name: 'unisex'
    }
};
