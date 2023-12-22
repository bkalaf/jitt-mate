import { ObjectSchema } from 'realm';
import { BacklineTypes } from '../../dal/enums/backlineTypes';
import { CollarTypes } from '../../dal/enums/collarTypes';
import { CuffTypes } from '../../dal/enums/cuffTypes';
import { NecklineTypes } from '../../dal/enums/necklineTypes';
import { SleeveTypes } from '../../dal/enums/sleeveTypes';
import { TopAdornments } from '../../dal/enums/topAdornments';
import { WaistTypes } from '../../dal/enums/waistTypes';
import { IApparelDetails, IMeasurementDictionary, IProduct, IRn, ISku } from '../../dal/types';
import { $db } from '../../dal/db';
import * as LaundryCare from '../../../laundry-care.json';
import { ApparelTypes } from '../../dal/enums/apparelType';

export type LaundryCareOptions = keyof typeof LaundryCare;
/* 
 @wrapInTransactionDecorator()
    update() {
        if (this.measurements == null) {
            this.measurements = {} as any;
        }
        return this;
    }
     constructor(realm: Realm, args: any) {
        super(realm, args);
        this.update();
    }
     backlineType: Optional<keyof BacklineTypes>;
    collarType: Optional<keyof CollarTypes>;
    cuffType: Optional<keyof CuffTypes>;
    cutNo: Optional<string>;
    measurements!: IMeasurementDictionary;
    necklineType: Optional<keyof NecklineTypes>;
    pocketCount: Optional<number>;
    size: Optional<string>;
    sleeveType: Optional<keyof SleeveTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    waistType: Optional<keyof WaistTypes>;
    */
export class ApparelDetails extends Realm.Object<IApparelDetails> implements IApparelDetails {
    frontType: Optional<string | number>;
    gender: Optional<string | number>;
    itemGroup: Optional<string | number>;
    legType: Optional<string | number>;
    apparelType: Optional<keyof ApparelTypes>;
    backlineType: Optional<keyof BacklineTypes>;
    chestFitType: Optional<'R' | 'L' | 'S'>;
    getProduct(): DBBacklink<IProduct> {
        // if (window.$$store == null) throw new Error('no saved store');
        return this.linkingObjects('product', 'apperalDetails');
    }
    getSku(): DBBacklink<ISku> {
        return this.getProduct()[0].linkingObjects('sku', 'product');
    }
    generateTitle(): string {
        throw new Error('Method not implemented.');
    }
    generateNarrative(): string {
        throw new Error('Method not implemented.');
    }
    clothingCare!: DBSet<LaundryCareOptions>;
    collarType: Optional<keyof typeof CollarTypes>;
    cuffType: Optional<keyof typeof CuffTypes>;
    cutNo: Optional<string>;
    measurements!: IMeasurementDictionary;
    necklineType: Optional<keyof NecklineTypes>;
    rn: OptionalEntity<IRn>;
    size: Optional<string>;
    sleeveType: Optional<keyof typeof SleeveTypes>;
    styleNo: Optional<string>;
    topAdornment: Optional<keyof TopAdornments>;
    waistType: Optional<keyof typeof WaistTypes>;
    update() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.measurements == null) this.measurements = {} as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.clothingCare == null) this.clothingCare = [] as any;
        return this;
    }
    static schema: ObjectSchema = {
        name: $db.apparelDetails(),
        embedded: true,
        properties: {
            apparelType: $db.string.opt,
            backlineType: $db.string.opt,
            chestFitType: $db.string.opt,
            clothingCare: $db.string.set,
            collarType: $db.string.opt,
            cuffType: $db.string.opt,
            cutNo: $db.string.opt,
            frontType: $db.string.opt,
            gender: $db.string.opt,
            itemGroup: $db.string.opt,
            legType: $db.string.opt,
            measurements: $db.float.dictionary,
            necklineType: $db.string.opt,
            pocketCount: $db.int.opt,
            rn: $db.rn.opt,
            size: $db.string.opt,
            sleeveType: $db.string.opt,
            styleNo: $db.string.opt,
            topAdornment: $db.string.opt,
            waistType: $db.string.opt
        }
    };
}
