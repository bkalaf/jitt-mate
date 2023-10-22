import { doesBarcodeHaveCheckDigit } from '../barcode';
import { checkTransaction } from '../util/checkTransaction';
import { $db, ILocationSegment, IProduct, IScan, ISku, Opt } from './db';
import Realm, { BSON } from 'realm';
import * as fs from 'graceful-fs';
import * as Config from './../config.json';
import { normalizeNewLine } from './normalizeNewLine';
import { nextScan } from './nextScan';

export const RESET_ALL = '029999999999';

export type ProductBarcodeInfo = [string, 'sku', ISku];
export type SkuBarcodeInfo = [string, 'sku', ISku];
export type LocationSegmentBarcodeInfo = [string, 'locationSegment', ILocationSegment];
export type ControlBarcodeInfo = [string, 'reset-all', undefined];

export class Scan extends Realm.Object<IScan> implements IScan {
    fixture: Opt<ILocationSegment>;
    shelf: Opt<ILocationSegment>;
    bin: Opt<ILocationSegment>;
    timestamp: Date = new Date(Date.now());
    
    static schema: Realm.ObjectSchema= {
        name: $db.scan(),
        embedded: true,
        properties: {
            fixture: $db.locationSegment.opt,
            shelf: $db.locationSegment.opt,
            bin: $db.locationSegment.opt,
            timestamp: $db.date()
        }
    }

    static locationSegments(realm: Realm) {
        return realm.objects<ILocationSegment>($db.locationSegment()).map(x => [x.barcode, $db.locationSegment(), x] as LocationSegmentBarcodeInfo);
    }
    static products(realm: Realm) {
        return realm.objects<ISku>($db.sku()).map(x => x.product?.upcs.map(upc => [upc, $db.sku(), x] as ProductBarcodeInfo) ?? []).reduce((pv, cv) => [...pv, ...cv], []);
    }
    static skus(realm: Realm) {
        return realm.objects<ISku>($db.sku()).map(x => [x.sku, $db.sku(), x] as SkuBarcodeInfo);
    }
    static controls() {
        return [[RESET_ALL, 'reset-all', undefined]] as ControlBarcodeInfo[];
    }
    static barcodes(realm: Realm) {
        return Object.fromEntries([...Scan.locationSegments(realm), ...Scan.products(realm), ...Scan.skus(realm), ...Scan.controls()].map(([k, d, v]) => [k, [d, v]] as [string, ['sku', ISku] | ['locationSegment', ILocationSegment] | ['reset-all', undefined]]));
    }
    static getItem(realm: Realm, bc: string) {
        const result = Scan.barcodes(realm)[bc];
        if (result == null) {
            return ["sku", realm.create<ISku>($db.sku(), { _id: new BSON.ObjectId(), sku: bc.padStart(12, '0') })] as ["sku", ISku]
        }
        return result;
    }
    static verifyBarcode(bc: string) {
        if (doesBarcodeHaveCheckDigit(bc)) {
            return bc.substring(0, bc.length - 1).padStart(12, '0');
        }
        throw new Error(`checkdigit mismatch: ${bc}`)
    }
    static processScans(realm: Realm, barcodes: string[]) {
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
        }
        checkTransaction(realm)(func);
    }
    static processScanFile(realm: Realm, fn: string) {
        const fullFileName = [Config.downloadsPath, fn].join('/');
        if (!fs.existsSync(fullFileName)) {
            throw new Error(`file does not exist: ${fullFileName}`)
        }
        const data = normalizeNewLine(fs.readFileSync(fullFileName).toString()).split('\n');
        const filteredData = data.filter(x => x != null).map(x => x.padStart(13, '0'));
        console.log(`scans to process: ${filteredData.length}`);
        Scan.processScans(realm, filteredData);
    }
}

