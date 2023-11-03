///<reference path="./../global.d.ts" />
import { Barcode } from './TBarcode';
import { ofNumber } from './ofNumber';
import { withPossiblePrecision } from './withPossiblePrecision';

export function toPercentageString(x?: StringOr<number>, precision?: number) {
    const n = ofNumber(x);
    return n != null ? `${withPossiblePrecision(n, precision)}%` : undefined;
}

export function ofBarcode(x?: string): string | undefined {
    return x == null ? undefined : x.padStart(12, '0');
}

console.log('straight scan with checkdigit');
console.log(Barcode.classify('07818105'));
console.log(Barcode.classify('860003320082'));
console.log(Barcode.classify('9780593330968'));
console.log(Barcode.classify('1587131676'));
console.log(Barcode.classify('011110048080'));
console.log(Barcode.classify('012000809996'));
console.log(Barcode.classify('016000263161'));
console.log('straight scan without checkdigit');
console.log(Barcode.classify('0781810'));
console.log(Barcode.classify('86000332008'));
console.log(Barcode.classify('978059333096'));
console.log(Barcode.classify('158713167'));
console.log(Barcode.classify('01111004808'));
console.log(Barcode.classify('01200080999'));
console.log(Barcode.classify('01600026316'));
console.log('padded to 12 scanned barcode with checkdigit');
console.log(Barcode.classify('07818105'));
console.log(Barcode.classify('860003320082'));
console.log(Barcode.classify('9780593330968'));
console.log(Barcode.classify('001587131676'));
console.log(Barcode.classify('011110048080'));
console.log(Barcode.classify('012000809996'));
console.log(Barcode.classify('016000263161'));
console.log('padded to 13 scanned barcode with checkdigit');
console.log(Barcode.classify('07818105'));
console.log(Barcode.classify('0860003320082'));
console.log(Barcode.classify('9780593330968'));
console.log(Barcode.classify('0001587131676'));
console.log(Barcode.classify('0011110048080'));
console.log(Barcode.classify('0012000809996'));
console.log(Barcode.classify('0016000263161'));
console.log('padded scanned barcode without checkdigit');
console.log(Barcode.classify('0781810'));
console.log(Barcode.classify('86000332008'));
console.log(Barcode.classify('978059333096'));
console.log(Barcode.classify('158713167'));
console.log(Barcode.classify('01111004808'));
console.log(Barcode.classify('01200080999'));
console.log(Barcode.classify('01600026316'));
console.log('testing');
console.log(Barcode.classify('499999000243'));
console.log(Barcode.classify('499999000281'));
console.log(Barcode.classify('495000000257'));
console.log(Barcode.classify('495000000325'));
console.log(Barcode.classify('410000000359'));
console.log(Barcode.classify('410000000687'));
console.log(Barcode.classify('410000001585'));
console.log(Barcode.classify('410000004784'));

