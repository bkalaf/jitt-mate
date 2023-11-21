import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IBarcode, ILocationSegment } from '../../dal/types';
import { LocationKinds } from '../../dal/enums/locationKinds';
import { LocationLabelColors, LocationLabelColorsColors, LocationLabelColorsKey, _LocationLabelColors } from '../../dal/enums/locationLabelColors';
import { LocationTypes, LocationTypesColors } from '../../dal/enums/locationTypes';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { basicListDecorator, basicLookupDecorator, basicTextboxDecorator } from './_basicTextboxDecorator';
import { Barcode } from './Barcode';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { META } from '../../dal/types/META';
import { basicEnumDecorator } from './_basicEnumDecorator';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';

@realmCollectionDecorator('name', 'barcode.rawValue')
export class LocationSegment extends Realm.Object<ILocationSegment> implements ILocationSegment {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
    }
    @basicLookupDecorator(Barcode, 'rawValue', { header: 'UPC' })
    get barcode(): OptionalEntity<IBarcode> {
        return this.upcs.length > 0 ? this.upcs[0] : undefined;
    }

    @basicListDecorator('barcode')
    upcs!: DBList<Entity<IBarcode>>;

    _barcode = '';
    
    @wrapInTransactionDecorator()
    update() {
        // const func = () => {
        //     t.barcode = t.barcode.padStart(12, '0');
        // };
        // checkTransaction(realm)(() => { return; });
        this.upcs.forEach((upc) => upc.update());
        return this;
    }
    @basicEnumDecorator({ enumMap: LocationTypes, colorMap: LocationTypesColors })
    type: Optional<keyof LocationTypes>;
    @basicEnumDecorator({ enumMap: LocationLabelColors, colorMap: LocationLabelColorsColors })
    color: Optional<LocationLabelColorsKey>;
    @basicTextboxDecorator()
    notes: Optional<string>;
    @basicEnumDecorator({ enumMap: LocationKinds })
    kind: Optional<keyof LocationKinds>;

    @META.col.oid
    _id: BSON.ObjectId = new BSON.ObjectId();
    // barcode: Optional<IBarcode>;
    @META.col.name
    name = '';

    static schema: Realm.ObjectSchema = {
        name: $db.locationSegment(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            barcode: $db.barcode.opt,
            // obs
            _barcode: $db.string.opt,
            name: $db.string.empty,
            type: $db.string.empty,
            color: $db.string.opt,
            notes: $db.string.opt,
            kind: $db.string.opt
        }
    };
    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
    // static columns: DefinedColumns = [
    //     // Def.OID(helper),
    //     // // Def.ctor('barcode.rawValue').barcode().displayName('UPC').$$(helper),
    //     // ...Barcode.embeddeColumns('barcode'),
    //     // Def.ctor('name').max(50).required().$$(helper),
    //     // Def.ctor('type').asEnum(LocationTypes).chip({
    //     //     fixture: 'bg-indigo-600 text-white',
    //     //     shelf: 'bg-rose-600 text-white',
    //     //     bin: 'bg-yellow-600 text-black'
    //     // }).$$(helper),
    //     // Def.ctor('color').asEnum(LocationLabelColors).chip({
    //     //     purple: 'bg-purple-500 text-white',
    //     //     yellow: 'bg-yellow-500 text-black',
    //     //     green: 'bg-emerald-800 text-white',
    //     //     orange: 'bg-orange-700 text-white',
    //     //     pink: 'bg-rose-600 text-white',
    //     //     white: 'bg-neutral-200 text-black',
    //     //     blue: 'bg-sky-700 text-white'
    //     // }).$$(helper),
    //     // Def.ctor('kind').asEnum(LocationKinds).$$(helper),
    //     // Def.ctor('notes').max(150).$$(helper)
    // ];
}
