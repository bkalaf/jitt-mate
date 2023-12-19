import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IBarcode, ILocationSegment } from '../../dal/types';
import { LocationKinds } from '../../dal/enums/locationKinds';
import { LocationLabelColorsKey, _LocationLabelColors } from '../../dal/enums/locationLabelColors';
import { LocationTypesObj } from '../../dal/enums/locationTypes';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';

export class LocationSegment extends Realm.Object<ILocationSegment> implements ILocationSegment {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [LocationSegment.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [LocationSegment.schema.name]
                        });
                    });
            })
        );  
    }
    get barcode(): OptionalEntity<IBarcode> {
        return this.upcs.length > 0 ? this.upcs[0] : undefined;
    }
    upcs!: DBList<Entity<IBarcode>>;

    @wrapInTransactionDecorator()
    update() {
        if (this.upcs == null) this.upcs = [] as any;
        this.upcs.forEach(x => x.update());
        return this;
    }
    // @basicEnumDecorator({ enumMap: LocationTypes, colorMap: LocationTypesColors })
    type: Optional<keyof typeof LocationTypesObj>;
    // @basicEnumDecorator({ enumMap: LocationLabelColors, colorMap: LocationLabelColorsColors })
    color: Optional<LocationLabelColorsKey>;
    // @basicTextboxDecorator()
    notes: Optional<string>;
    // @basicEnumDecorator({ enumMap: LocationKinds })
    kind: Optional<keyof LocationKinds>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    // barcode: Optional<IBarcode>;
    name = '';

    static schema: Realm.ObjectSchema = {
        name: $db.locationSegment(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            type: $db.string.empty,
            color: $db.string.opt,
            notes: $db.string.opt,
            kind: $db.string.opt,
            upcs: $db.barcode.list
        }
    };

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
