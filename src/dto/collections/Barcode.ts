// ///<reference path="./../../global.d.ts" />
import Realm from 'realm';
import { $db } from '../../dal/db';
import { BarcodeTypesKey } from '../../dal/enums/barcodeTypes';
import { IBarcode } from '../../dal/types';
import { sum } from '../../common/math/sum';
import { konst } from '../../common/functions/konst';
import { unpad } from '../../dal/unpad';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';

@realmCollectionDecorator('rawValue', 'rawValue')
export class Barcode extends Realm.Object<IBarcode> implements IBarcode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [Barcode.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [Barcode.schema.name]
                        });
                    });
            })
        );  
    }
    get ordinal(): number {
        return parseInt(this.barcode.split('').reverse().slice(0, 5).reverse().join(''), 10);
    }
    static getISBN10CheckDigit(barcode: string): string {
        const multi = [10, 9, 8, 7, 6, 5, 4, 3, 2, 0];
        const value =
            11 -
            (barcode
                .padStart(10, '0')
                .split('')
                .slice(0, barcode.length - 1)
                .map((x, ix) => parseInt(x, 10) * multi[ix])
                .reduce(sum, 0) %
                11);
        return value === 10 ? 'X' : value.toString();
    }
    static getEANCheckDigit(barcode: string): string {
        const multi = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 0];
        const value =
            10 -
            (barcode
                .padStart(13, '0')
                .split('')
                .map((x, ix) => parseInt(x, 10) * multi[ix])
                .reduce(sum, 0) %
                10);
        return value === 10 ? '0' : value.toString();
    }
    static expandTruncated(barcode: string): string {
        function getExpander(value: number) {
            switch (value) {
                case 1:
                    return [(x: string) => x.slice(0, 2), konst('10000'), (x: string) => x.slice(2, 5), (x: string) => x.slice(6, 7)];
                case 2:
                    return [(x: string) => x.slice(0, 2), konst('20000'), (x: string) => x.slice(2, 5), (x: string) => x.slice(6, 7), (x: string) => x.slice(6, 7)];
                case 3:
                    return [(x: string) => x.slice(0, 3), konst('00000'), (x: string) => x.slice(3, 5), (x: string) => x.slice(6, 7)];
                case 4:
                    return [(x: string) => x.slice(0, 4), konst('00000'), (x: string) => x.slice(4, 5), (x: string) => x.slice(6, 7)];
                case 5:
                    return [(x: string) => x.slice(0, 5), konst('00005'), konst(''), (x: string) => x.slice(6, 7)];
                case 6:
                    return [(x: string) => x.slice(0, 5), konst('00006'), konst(''), (x: string) => x.slice(6, 7)];
                case 7:
                    return [(x: string) => x.slice(0, 5), konst('00007'), konst(''), (x: string) => x.slice(6, 7)];
                case 8:
                    return [(x: string) => x.slice(0, 5), konst('00008'), konst(''), (x: string) => x.slice(6, 7)];
                case 9:
                    return [(x: string) => x.slice(0, 5), konst('00009'), konst(''), (x: string) => x.slice(6, 7)];
                case 0:
                    return [(x: string) => x.slice(0, 2), konst('00000'), (x: string) => x.slice(2, 5)];
                default:
                    throw new Error('bad expand');
            }
        }
        const digit = parseInt(barcode.split('').reverse().slice(1, 2).join(''), 10);
        return getExpander(digit)
            .map((f) => f(barcode))
            .join('');
    }
    static calculateCheckDigit(barcode: string): [BarcodeTypesKey, string] {
        const cd = barcode[barcode.length - 1];
        const bc = unpad(barcode);
        if (bc.length <= 10) {
            const calc = Barcode.getISBN10CheckDigit(bc);
            if (cd === calc) return ['isbn10', barcode];
        }
        const calc = Barcode.getEANCheckDigit(bc);
        if (calc === cd) {
            if (bc.length === 13 && (bc.startsWith('978') || bc.startsWith('979'))) return ['isbn13', barcode];
            if (bc.length === 12 && unpad(barcode).startsWith('4')) {
                if (bc.startsWith('49')) return ['locator', barcode];
                return ['sku', barcode];
            }
            if (bc.length <= 12) return ['upcA', barcode];
            if (bc.length === 13) return ['ean13', barcode];
            throw new Error(`could not classify: ${barcode}`);
        }
        if (barcode.length === 8) {
            const expanded = Barcode.expandTruncated(barcode);
            const [type] = Barcode.calculateCheckDigit(expanded);
            if (type === 'upcA') return ['upcE', barcode];
        }
        throw new Error(`could not classify: ${barcode}`);
    }
    static classify(barcode: string): [true, BarcodeTypesKey] | [false] {
        try {
            const [type] = Barcode.calculateCheckDigit(barcode);
            return [true, type];
        } catch (error) {
            console.log(JSON.stringify(error, null, '\t'));
            console.log((error as Error).message);
            console.log((error as Error).name);
            console.error(`BARCODE CLASSIFY ERROR: ${barcode}`);
            return [false];
        }
    }
    @wrapInTransactionDecorator()
    update(): Entity<IBarcode> {
        // return runInTransaction(this, realm, () => {
        //     const bc = this.rawValue.padStart(13, '0');
        //     if (this.rawValue !== bc) {
        //         this.rawValue = bc;
        //     }
        //     const [valid, type] = Barcode.classify(bc);
        //     this.valid = valid;
        //     this.type = type;
        // });
        if (this.rawValue.length !== 13) {
            this.rawValue = this.rawValue.padStart(13, '0');
        }
        const [valid, type] = Barcode.classify(this.rawValue);
        this.valid = valid;
        this.type = type;
        return this;
    }
    equalTo(value: string): boolean {
        return this.rawValue === value;
    }
    equalToWithoutCheckdigit(value: string): boolean {
        return this.barcode === unpad(value);
    }
    scanEqual(value: string): boolean {
        return this.scanValue === unpad(value);
    }
    get checkdigit(): string {
        return this.rawValue.split('').reverse()[0];
    }
    get barcode(): string {
        return this.scanValue.slice(0, this.scanValue.length - 1);
    }
    get scanValue(): string {
        return unpad(this.rawValue);
    }
    get isUPC(): boolean {
        return ['isbn13', 'isbn10', 'upcA', 'upcE', 'ean13'].includes(this.type ?? '');
    }
    get isISBN(): boolean {
        return this.type === 'isbn10' || this.type === 'isbn13';
    }
    get isLocator(): boolean {
        return this.type === 'locator';
    }
    get isSKU(): boolean {
        return this.type === 'sku';
    }
    get isTruncated(): boolean {
        return this.type === 'upcE';
    }
    rawValue = '';
    valid = false;
    type: Optional<BarcodeTypesKey>;
    static ctor(value: string, callRealm = false) {
        const result = {
            rawValue: value,
            type: 'ean13',
            valid: false
        } as WithoutAccessors<IBarcode>;
        if (callRealm) {
            const db = window.$$store;
            if (db == null) throw new Error('no realm');
            return db.create<IBarcode>('barcode', result);
        }
        return result;
    }
    static ctorWithoutCheckdigit(value: string) {
        const cd = Barcode.getEANCheckDigit(value.concat('0'));
        return Barcode.ctor([value, cd].join(''));
    }
    static schema: Realm.ObjectSchema = {
        name: $db.barcode(),
        embedded: true,
        properties: {
            valid: $db.bool.false,
            rawValue: $db.string(),
            type: { type: 'string', default: 'ean13' }
        }
    };
}

console.log(Barcode.ctorWithoutCheckdigit('49500000062'));
console.log(Barcode.ctorWithoutCheckdigit('49500000069'));
console.log(Barcode.ctorWithoutCheckdigit('49500000059'));
