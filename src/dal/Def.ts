import { BSON } from 'realm';
import { $db } from './db';
import { ColumnDef, ColumnHelper, ColumnMeta, DeepKeys, IdentifiedColumnDef } from '@tanstack/react-table';
import { fromOID } from './fromOID';
import { dateFromNow } from './dateFromNow';
import { capitalize, decapitalize } from '../common/text/capitalize';

export class Def<T, TValue = any> {
    backing: [DeepKeys<T>, JITTColumnDef<T, TValue>];
    constructor(name: DeepKeys<T>, datatype: RealmTypes) {
        this.backing = [name, { meta: { datatype } }];
    }
    static ctor<T, TValue = any>(name: DeepKeys<T>, datatype: RealmTypes = 'string'): Def<any, any> {
        return new Def<T, TValue>(name, datatype);
    }
    $$(helper: ColumnHelper<T>): DefinedColumn {
        return helper.accessor(...this.backing);
    }
    addToMeta<TKey extends keyof ColumnMeta<T, TValue>>(metaProperty: TKey, value: ColumnMeta<T, TValue>[TKey]): Def<any, any> {
        this.backing[1].meta[metaProperty] = value;
        return this;
    }
    addToDef<TKey extends JITTColumnDef<T, TValue>>(defProperty: TKey, value: JITTColumnDef<T, TValue>[TKey]): Def<any, any> {
        this.backing[1][defProperty] = value;
        return this;
    }

    setDataType(datatype: RealmTypes): Def<any, any> {
        this.backing[1].meta.datatype = datatype;
        return this;
    }
    displayName(name: string): Def<any, any> {
        return this.addToDef('header', name).addToDef('footer', decapitalize(name.toLowerCase().split(' ').map(capitalize).join('')).replaceAll(' ', ''));
    }
    id(name: string): Def<any, any> {
        return this.addToDef('id', name);
    }
    initializer(func: RealmInitializer): Def<any, any> {
        return this.addToMeta('defaultValue', func);
    }
    defaultValue(value: ReturnType<RealmInitializer>): Def<any, any> {
        return this.addToMeta('defaultValue', value);
    }
    required(): Def<any, any> {
        return this.addToMeta('required', true);
    }
    readonly(): Def<any, any> {
        return this.addToMeta('readonly', true);
    }
    enumMap<TKey extends string>(enumMap: EnumMap<TKey>): Def<any, any> {
        return this.addToMeta('enumMap', enumMap);
    }
    objectType(ot: RealmObjects): Def<any, any> {
        return this.addToMeta('objectType', $db[ot]() as RealmObjects);
    }
    asLookup(objectType?: RealmObjects): Def<any, any> {
        const result = this.setDataType('object');
        if (objectType == null) return result.objectType(this.backing[0] as RealmObjects);
        return result.objectType(objectType);
    }
    asEnum<TKey extends string>(enumMap: EnumMap<TKey>): Def<any, any> {
        return this.setDataType('enum').enumMap(enumMap);
    }
    inputType(inputType: React.HTMLInputTypeAttribute): Def<any, any> {
        return this.addToMeta('inputType', inputType);
    }
    validator(...validator: Validator<TValue | undefined>[]): Def<any, any> {
        const [_, curr2] = this.backing as [any, DefinedColumn];
        const currArray = curr2.meta?.validators;
        return this.addToMeta('validators', [...(currArray ?? []), ...validator]);
    }
    min(min: number): Def<any, any> {
        const [_, curr2] = this.backing as [any, DefinedColumn];
        const { datatype } = { ...{}, ...curr2.meta };
        if (['int', 'decimal128', 'float', 'double'].includes(datatype ?? '')) {
            return this.addToMeta('min', min);
        }
        return this.addToMeta('minLength', min);
    }
    pattern(pattern: RegExp): Def<any, any> {
        return this.addToMeta('pattern', pattern);
    }
    multiple(): Def<any, any> {
        return this.addToMeta('multiple', true);
    }
    max(max: number): Def<any, any> {
        const [_, curr2] = this.backing as [any, DefinedColumn];
        const { datatype } = { ...{}, ...curr2.meta };
        if (['int', 'decimal128', 'float', 'double'].includes(datatype ?? '')) {
            return this.addToMeta('max', max);
        }
        return this.addToMeta('maxLength', max);
    }
    int(defValue = 0): Def<any, any> {
        return this.setDataType('int').defaultValue(defValue).inputType('number');
    }
    precision(precise = 2): Def<any, any> {
        return this.addToMeta('precision', precise);
    }
    float(defValue = 0, precise = 4): Def<any, any> {
        return this.setDataType('float').precision(precise).defaultValue(defValue).inputType('number');
    }
    multiplier(multi: number): Def<any, any> {
        return this.addToMeta('multiplier', multi);
    }
    formatter(func: (x: any) => string): Def<any, any> {
        return this.addToMeta('formatString', func);
    }
    bool(defValue = false): Def<any, any> {
        return this.setDataType('bool').defaultValue(defValue).inputType('checkbox');
    }
    url(): Def<any, any> {
        return this.setDataType('string').inputType('url');
    }
    email(): Def<any, any> {
        return this.setDataType('string').inputType('email');
    }
    tel(): Def<any, any> {
        return this.setDataType('string').inputType('tel');
    }
    // zipcode() {}
    barcode() {
        return this.setDataType('string').max(12).min(12).pattern(/^[0-9]{12}$/).inputType('text');
    }
    asDate(dateOnly = false, initialNow = false) {
        const result = this.setDataType('date')
            .inputType(dateOnly ? 'date' : 'datetime-local')
            .formatter((x: Date) => (dateOnly ? x.toLocaleDateString() : x.toLocaleString()));
        return initialNow ? result.initializer(dateFromNow) : result;
    }
    percentage(min?: number, max?: number): Def<any, any> {
        const result = this.float(0, 4)
            .multiplier(100)
            .formatter((x: number) => `${x.toFixed(2)}%`);
        const apply1 = min ? (x: Def<any, any>) => x.min(min) : (x: Def<any, any>) => x;
        const apply2 = max ? (x: Def<any, any>) => x.max(max) : (x: Def<any, any>) => x;
        return apply1(apply2(result));
    }
    static OID<T>(helper: ColumnHelper<any>): DefinedColumn {
        return helper.accessor((x) => fromOID(x._id), {
            id: '_id',
            header: 'OID',
            meta: { datatype: 'objectId', required: true, readonly: true, defaultValue: () => new BSON.ObjectId() }
        }) as ColumnDef<T, BSON.ObjectId>;
    }
}
