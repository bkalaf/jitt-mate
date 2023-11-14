import { doesBarcodeHaveCheckDigit } from '../barcode';
import { checkTransaction } from '../util/checkTransaction';
import { $db } from './db';
import Realm, { BSON } from 'realm';
import * as fs from 'graceful-fs';
import * as Config from '../config.json';
import { normalizeNewLine } from './normalizeNewLine';
import { nextScan } from './nextScan';
import { IBarcode, ILocationSegment, IScan, ISku } from './types';
import { dateFromNow } from './dateFromNow';
import { createColumnHelper } from '@tanstack/react-table';
import { Barcode } from '../dto/collections/Barcode';

export const RESET_ALL = '029999999999';

export type ProductBarcodeInfo = [string, 'sku', ISku];
export type SkuBarcodeInfo = [string, 'sku', ISku];
export type LocationSegmentBarcodeInfo = [string, 'locationSegment', ILocationSegment];
export type ControlBarcodeInfo = [string, 'reset-all', undefined];

const helper = createColumnHelper();
export const Scanning = {
    locationSegments: (realm: Realm) => {
        return realm.objects<ILocationSegment>($db.locationSegment()).map((x) => [x.barcode?.scanValue, $db.locationSegment(), x] as LocationSegmentBarcodeInfo);
    },
    products: (realm: Realm) => {
        return realm
            .objects<ISku>($db.sku())
            .map((x) => x.product?.upcs.map((upc) => [upc?.scanValue, $db.sku(), x] as ProductBarcodeInfo) ?? [])
            .reduce((pv, cv) => [...pv, ...cv], []);
    },
    skus: (realm: Realm) => {
        return realm.objects<ISku>($db.sku()).map((x) => x.upcs.map((upc) => [upc.scanValue, $db.sku(), x] as SkuBarcodeInfo)).reduce((pv, cv) => [...pv, ...cv], []);
    },
    controls: () => {
        return [[RESET_ALL, 'reset-all', undefined]] as ControlBarcodeInfo[];
    },
    barcodes: (realm: Realm) => {
        return Object.fromEntries(
            [...Scanning.locationSegments(realm), ...Scanning.products(realm), ...Scanning.skus(realm), ...Scanning.controls()].map(
                ([k, d, v]) => [k, [d, v]] as [string, ['sku', ISku] | ['locationSegment', ILocationSegment] | ['reset-all', undefined]]
            )
        );
    },
    getItem: (realm: Realm, bc: string) => {
        const result = Scanning.barcodes(realm)[bc];
        if (result == null) {
            return ['sku', realm.create<ISku>($db.sku(), { _id: new BSON.ObjectId(), upcs: [Barcode.ctor(bc.padStart(13, '0')) as unknown as IBarcode] })] as ['sku', ISku];
        }
        return result;
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

export class Scan extends Realm.Object<IScan> implements IScan {
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
    static labelProperty: keyof IScan = 'bin';
    static defaultSort: Realm.SortDescriptor[] = ['fixture', 'shelf', 'bin'];
    static columns: DefinedColumns = [
        // Def.ctor('fixture').asLookup('locationSegment').$$(helper),
        // Def.ctor('shelf').asLookup('locationSegment').$$(helper),
        // Def.ctor('bin').asLookup('locationSegment').$$(helper),
        // Def.ctor('timestamp').asDate(false, true).$$(helper)
    ];
}
