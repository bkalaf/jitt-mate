import { ObjectSchema } from 'realm';
import { BacklineTypes } from '../../dal/enums/backlineTypes';
import { CollarTypes } from '../../dal/enums/collarTypes';
import { CuffTypes } from '../../dal/enums/cuffTypes';
import { NecklineTypes } from '../../dal/enums/necklineTypes';
import { SleeveTypes } from '../../dal/enums/sleeveTypes';
import { TopAdornments } from '../../dal/enums/topAdornments';
import { WaistTypes } from '../../dal/enums/waistTypes';
import { IApparelDetails, IMeasurementDictionary, IRn } from '../../dal/types';
import { $db } from '../../dal/db';
import * as LaundryCare from '../../../laundry-care.json';

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
    backlineType: Optional<keyof BacklineTypes>;
    clothingCare!: DBSet<LaundryCareOptions>;
    collarType: Optional<keyof CollarTypes>;
    cuffType: Optional<keyof CuffTypes>;
    cutNo: Optional<string>;
    measurements!: IMeasurementDictionary;
    necklineType: Optional<keyof NecklineTypes>;
    pocketCount: Optional<number>;
    rn: OptionalEntity<IRn>;
    size: Optional<string>;
    sleeveType: Optional<keyof SleeveTypes>;
    styleNo: Optional<string>;
    topAdornment: Optional<keyof TopAdornments>;
    waistType: Optional<keyof WaistTypes>;
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
            backlineType: $db.string.opt,
            clothingCare: $db.string.set,
            collarType: $db.string.opt,
            cuffType: $db.string.opt,
            cutNo: $db.string.opt,
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
