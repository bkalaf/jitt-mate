export interface MaterialTypes {
    A: string;
    C: string;
    CS: string;
    D: string;
    E: string;
    H: string;
    K: string;
    L: string;
    M: string;
    N: string;
    OC: string;
    P: string;
    R: string;
    U: string;
    W: string;
    X: string;
}
export const MaterialTypes = {
    A: 'acrylic',
    C: 'cotton',
    CS: 'cashmere',
    D: 'denim',
    E: 'polyurethane',
    H: 'leather',
    K: 'silk',
    L: 'linen',
    M: 'modal',
    N: 'nylon',
    OC: 'organic cotton',
    P: 'polyester',
    R: 'rayon',
    U: 'suede',
    W: 'wool',
    X: 'spandex'
};

export type MaterialTypesKey = keyof MaterialTypes;