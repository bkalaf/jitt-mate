

export function toGridCols(qty: number) {
    switch (qty) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            return 'grid-cols-4';
        case 5:
            return 'grid-cols-5';
        case 6:
            return 'grid-cols-6';
        case 7:
            return 'grid-cols-7';
        case 8:
            return 'grid-cols-8';
        case 9:
            return 'grid-cols-9';
        default:
            return 'grid-cols-10';
    }
}
