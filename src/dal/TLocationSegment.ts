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
            _barcode: $db.string.empty,
            name: $db.string.empty,
            type: $db.string.empty,
            color: $db.string.opt,
            notes: $db.string.opt,
            kind: $db.string.opt
        }
    };
    static labelProperty: keyof ILocationSegment = 'name';
    static defaultSort: Realm.SortDescriptor[] = ['barcode.rawValue', 'name'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('barcode.type').readonly().asEnum(BarcodeTypes).displayName('Barcode Type').$$(helper),
        Def.ctor('barcode.rawValue').barcode().displayName('UPC').$$(helper),
        Def.ctor('name').max(50).required().$$(helper),
        Def.ctor('type').asEnum(LocationTypes).$$(helper),
        Def.ctor('color').asEnum(LocationLabelColors).$$(helper),
        Def.ctor('kind').asEnum(LocationKinds).$$(helper),
        Def.ctor('notes').max(150).$$(helper)
    ];
}
