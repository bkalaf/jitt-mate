import Realm, { BSON } from 'realm';
import { $db } from './db';
import { IBarcode, ILocationSegment } from './types';
import { checkTransaction } from '../util/checkTransaction';
import { Def } from './Def';
import { createColumnHelper } from '@tanstack/react-table';
import { LocationKinds } from './enums/locationKinds';
import { LocationLabelColors } from './enums/locationLabelColors';
import { LocationTypes } from './enums/locationTypes';
import { BarcodeTypes } from './enums/barcodeTypes';
import { Barcode } from './TBarcode';

const helper = createColumnHelper();
export class LocationSegment extends Realm.Object<LocationSegment> implements ILocationSegment {
    _barcode = '';
    update<T>(this: T, realm: Realm): T {
        const t = this as ILocationSegment;
        // const func = () => {
        //     t.barcode = t.barcode.padStart(12, '0');
        // };
        checkTransaction(realm)(() => { return; });
        return this;
    }
    type: Optional<keyof LocationTypes>;
    color: Optional<keyof LocationLabelColors>;
    notes: Optional<string>;
    kind: Optional<keyof LocationKinds>;

    _id: BSON.ObjectId = new BSON.ObjectId();
    barcode: Optional<IBarcode>;
    name = '';

    static schema: Realm.ObjectSchema = {
        name: $db.locationSegment(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            barcode: $db.barcode.opt,
            _barcode: $db.string.opt,
            name: $db.string.empty,
            type: $db.string.empty,
            color: $db.string.opt,
            notes: $db.string.opt,
            kind: $db.string.opt
        }
    };
    static labelProperty: keyof ILocationSegment = 'name';
    static defaultSort: Realm.SortDescriptor[] = ['barcode.rawValue'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        // Def.ctor('barcode.rawValue').barcode().displayName('UPC').$$(helper),
        ...Barcode.embeddeColumns('barcode'),
        Def.ctor('name').max(50).required().$$(helper),
        Def.ctor('type').asEnum(LocationTypes).chip({
            fixture: 'bg-indigo-600 text-white',
            shelf: 'bg-rose-600 text-white',
            bin: 'bg-yellow-600 text-black'
        }).$$(helper),
        Def.ctor('color').asEnum(LocationLabelColors).chip({
            purple: 'bg-purple-500 text-white',
            yellow: 'bg-yellow-500 text-black',
            green: 'bg-emerald-800 text-white',
            orange: 'bg-orange-700 text-white',
            pink: 'bg-rose-600 text-white',
            white: 'bg-neutral-200 text-black',
            blue: 'bg-sky-700 text-white'
        }).$$(helper),
        Def.ctor('kind').asEnum(LocationKinds).$$(helper),
        Def.ctor('notes').max(150).$$(helper)
    ];
}
