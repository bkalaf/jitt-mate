import Realm, { BSON } from 'realm';
import { $db } from './db';
import { ILocationSegment } from './types';
import { checkTransaction } from '../util/checkTransaction';
import { Def } from './Def';
import { createColumnHelper } from '@tanstack/react-table';
import { LocationKinds } from './enums/locationKinds';
import { LocationLabelColors } from './enums/locationLabelColors';
import { LocationTypes } from './enums/locationTypes';

const helper = createColumnHelper();
export class LocationSegment extends Realm.Object<LocationSegment> implements ILocationSegment {
    type: Optional<keyof LocationTypes>;
    color: Optional<keyof LocationLabelColors>;
    notes: Optional<string>;
    kind: Optional<keyof LocationKinds>;

    update(this: ILocationSegment, realm: Realm): ILocationSegment {
        const func = () => {
            this.barcode = this.barcode.padStart(12, '0');
        };
        checkTransaction(realm)(func);
        return this;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    barcode = '';
    name = '';

    static schema: Realm.ObjectSchema = {
        name: $db.locationSegment(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            barcode: $db.string.empty,
            name: $db.string.empty,
            type: $db.string.empty,
            color: $db.string.opt,
            notes: $db.string.opt,
            kind: $db.string.opt
        }
    };
    static labelProperty: keyof ILocationSegment = 'barcode';
    static defaultSort: Realm.SortDescriptor[] = [['barcode', false], 'name'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('barcode')
            .barcode()
            .required()
            .formatter((x: string) => {
                const arr = x.padStart(12, '0').split('');
                return [[...arr.slice(0, 2)].join(''), [...arr.slice(2, 7)].join(''), [...arr.slice(7)].join('')].join('-');
            }).$$(helper),
        Def.ctor('name').max(50).required().$$(helper),
        Def.ctor('type').asEnum(LocationTypes).$$(helper),
        Def.ctor('color').asEnum(LocationLabelColors).$$(helper),
        Def.ctor('kind').asEnum(LocationKinds).$$(helper),
        Def.ctor('notes').max(150).$$(helper)
    ];
}
