export type LocationKinds = {
    square: string;
    'half-square': string;
    'metro-rack': string;
    'metro-shelf': string;
    area: string;
    'storage-tote': string;
    'under-table': string;
    'over-table': string;
    closet: string;
    stack: string;
    box: string;
    'dvd-bag': string;
    'vhs-bag': string;
};

export const LocationKinds = {
    square: 'square',
    'half-square': 'half-square',
    'metro-rack': 'metro-rack',
    'metro-shelf': 'metro-shelf',
    area: 'area',
    'storage-tote': 'storage-tote',
    'under-table': 'under-table',
    'over-table': 'over-table',
    closet: 'closet',
    stack: 'stack',
    box: 'box',
    'dvd-bag': 'dvd-bag',
    'vhs-bag': 'vhs-bag'
};

export type LocationKindsKey = keyof LocationKinds;