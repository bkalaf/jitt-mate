import { sum } from './common/math/sum';

export function calculateCheckDigit(bc: string) {
    const b = bc.padStart(12, '0');
    if (b.startsWith('000')) {
        // console.log('isbn-10');
        const multipliers = [0, 0, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        const digits = b
            .split('')
            .map((x) => parseInt(x, 10))
            .map((x, ix) => x * multipliers[ix])
            .reduce(sum, 0);
        const cd = 11 - (digits % 11);
        return cd === 10 ? 'X' : cd.toString();
    }
    // console.log('ean');
    const multipliers = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
    const digits = b
        .split('')
        .map((x) => parseInt(x, 10))
        .map((x, ix) => x * multipliers[ix])
        .reduce(sum, 0);
    const cd = 10 - (digits % 10);
    return cd === 10 ? '0' : cd.toString();
}
export function doesBarcodeHaveCheckDigit(bc: string) {
    // console.log(`doesBarcodeHaveCheckDigit`);
    // console.log(JSON.stringify(bc))
    const checkdigit = bc.split('')[bc.length - 1];
    const barcode = bc.substring(0, bc.length - 1);
    // console.log(`bc: ${bc} barcode: ${barcode} checkdigit: ${checkdigit}`)
    const calculated = calculateCheckDigit(barcode);
    // console.log(`calculated: ${calculated} has: ${checkdigit}`)
    return checkdigit === calculated;
}
export function parseBarcode(bc: string) {
    if (doesBarcodeHaveCheckDigit(bc)) {
        // console.log('no checkdigit');
        return bc.substring(0, bc.length - 1).padStart(12, '0');
    }
    // console.log('has checkdigit')
    return bc.padStart(12, '0');
}
// console.log(calculateCheckDigit('002200015933')); // '5'
// console.log(calculateCheckDigit('007940007216')); // '0'
// console.log(calculateCheckDigit('978147679605')); // '5'
// console.log(calculateCheckDigit('147679605')); // 'X'
// console.log(doesBarcodeHaveCheckDigit('002200015933')); // '5'
// console.log(doesBarcodeHaveCheckDigit('007940007216')); // '0'
// console.log(doesBarcodeHaveCheckDigit('978147679605')); // '5'
// console.log(doesBarcodeHaveCheckDigit('147679605'));
// console.log(doesBarcodeHaveCheckDigit('0022000159335')); // '5'
// console.log(doesBarcodeHaveCheckDigit('0079400072160')); // '0'
// console.log(doesBarcodeHaveCheckDigit('9781476796055')); // '5'
// console.log(doesBarcodeHaveCheckDigit('147679605X'));
// console.log(parseBarcode('22000159335')); // '5'
// console.log(parseBarcode('79400072160')); // '0'
// console.log(parseBarcode('9781476796055')); // '5'
// console.log(parseBarcode('147679605X'));
