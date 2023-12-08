import { doesBarcodeHaveCheckDigit } from '../../barcode';
import { checkTransaction } from '../../util/checkTransaction';
import { $db } from '../../dal/db';
import Realm from 'realm';
import * as fs from 'graceful-fs';
import * as Config from '../../config.json';
import { normalizeNewLine } from '../../dal/normalizeNewLine';
import { nextScan } from '../../dal/nextScan';
import { ILocationSegment, IProduct, IRealmObject, IScan, ISku } from '../../dal/types';
import { dateFromNow } from '../../common/date/dateFromNow';
import { wrapInTransactionDecorator } from '../../dal/transaction';

export const RESET_ALL = '029999999999';

// export type ProductBarcodeInfo = [string, 'sku', ISku];
// export type SkuBarcodeInfo = [string, 'sku', ISku];
// export type LocationSegmentBarcodeInfo = [string, 'locationSegment', ILocationSegment];
// export type ControlBarcodeInfo = [string, 'reset-all', undefined];

export interface IScanEntryBase<TDiscriminator extends string, T> {
    barcode: string;
    discriminator: TDiscriminator;
    value: T;
}
type LocationScan = IScanEntryBase<'locationSegment', ILocationSegment>;
type InventoryItemScan = IScanEntryBase<'sku', ISku>;
type ProductUPCScan = IScanEntryBase<'product', IProduct>;
type ControlCodeScan = IScanEntryBase<'reset-all', undefined>;

export type Scans = LocationScan | InventoryItemScan | ProductUPCScan | ControlCodeScan;

// export interface IScanEntry {
//     barcode: string;
//     discriminator: 'sku' | 'locationSegment' | 'reset-all' | 'product';
//     value: ISku | ILocationSegment | IProduct;
// }
export const Scanning = {
    locationSegments: (realm: Realm) => {
        return realm.objects<ILocationSegment>($db.locationSegment()).map((x) => ({
            value: x,
            discriminator: 'locationSegment',
            barcode: x.barcode?.scanValue ?? '0'
        } as LocationScan));
    },
    products: (realm: Realm) => {
        return realm
            .objects<IProduct>($db.sku())
            .map((x) =>
                x.upcs.map(
                    (bc) =>
                        ({
                            value: x,
                            discriminator: 'product',
                            barcode: bc?.scanValue ?? '0'
                        } as ProductUPCScan)
                )
            )
            .reduce((pv, cv) => [...pv, ...cv], []);
    },
    skus: (realm: Realm) => {
        return realm.objects<ISku>($db.sku()).map((x) => x.upcs.map((upc) => ({
            value: x,
            discriminator: 'sku',
            barcode: upc?.scanValue
        } as InventoryItemScan))).reduce((pv, cv) => [...pv, ...cv], []);
    },
    controls: () => {
        // [RESET_ALL, 'reset-all', undefined]
        return [{
            value: undefined,
            discriminator: 'reset-all',
            barcode: RESET_ALL
        } as ControlCodeScan];
    },
    barcodes: (realm: Realm) => {
        return Object.fromEntries(
            ([...Scanning.locationSegments(realm), ...Scanning.products(realm), ...Scanning.skus(realm), ...Scanning.controls()] as Scans[]).map(
                ({
                    discriminator,
                    value,
                    barcode
                }) => [barcode, { discriminator, value }] as [string, { discriminator: Scans['discriminator'], value: Scans['value'] }]
            )
        );
    },
    getItem: (realm: Realm, bc: string) => {
        const result = Scanning.barcodes(realm)[bc];
        if (result == null) {
            throw new Error(`barcode not found: ${bc}`)
        }
        return [bc, result];
    },
    verifyBarcode: (bc: string) => {
        if (doesBarcodeHaveCheckDigit(bc)) {
            return bc.substring(0, bc.length - 1).padStart(12, '0');
        }
        throw new Error(`checkdigit mismatch: ${bc}`);
    },
    processScans: (realm: Realm, barcodes: string[]) => {
        const func = () => {
            let todo = barcodes;
            let current: IScan = { timestamp: new Date(Date.now()) } as unknown as IScan;
            while (todo.length > 0) {
                const result = nextScan(current, realm, todo);
                if (result.length == 0) {
                    todo = [];
                } else {
                    const [nextUp, remain] = result;
                    console.log(`nextUp: fixture: ${nextUp.fixture?.name ?? 'n/a'} shelf: ${nextUp.shelf?.name ?? 'n/a'} bin: ${nextUp.bin?.name}`);
                    todo = remain;
                    current = nextUp;
                }
            }
        };
        checkTransaction(realm)(func);
    },
    processScanFile: (realm: Realm, fn: string) => {
        const fullFileName = [Config.downloadsPath, fn].join('/');
        if (!fs.existsSync(fullFileName)) {
            throw new Error(`file does not exist: ${fullFileName}`);
        }
        const data = normalizeNewLine(fs.readFileSync(fullFileName).toString()).split('\n');
        const filteredData = data.filter((x) => x != null).map((x) => x.padStart(13, '0'));
        console.log(`scans to process: ${filteredData.length}`);
        Scanning.processScans(realm, filteredData);
    }
};

export class Scan extends Realm.Object<IScan> implements IScan, IRealmObject<IScan> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(realm: Realm, args: any) {
        super(realm, args);
        this.update();
    }
    @wrapInTransactionDecorator()
    update() {
        if (this.timestamp == null) this.timestamp = dateFromNow();
        return this;
    }
    fixture: Optional<Entity<ILocationSegment>>;
    shelf: Optional<Entity<ILocationSegment>>;
    bin: Optional<Entity<ILocationSegment>>;
    timestamp: Date = dateFromNow();

    static ctor(fixture?: ILocationSegment, shelf?: ILocationSegment, bin?: ILocationSegment) {
        return { timestamp: dateFromNow(), fixture, shelf, bin } as IScan;
    }
    static schema: Realm.ObjectSchema = {
        name: $db.scan(),
        embedded: true,
        properties: {
            fixture: $db.locationSegment.opt,
            shelf: $db.locationSegment.opt,
            bin: $db.locationSegment.opt,
            timestamp: $db.date()
        }
    };
}
