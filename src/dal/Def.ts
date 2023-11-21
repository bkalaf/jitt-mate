import { BSON } from 'realm';
import { $db } from './db';
import { ColumnDef, ColumnHelper, ColumnMeta, DeepKeys, IdentifiedColumnDef } from '@tanstack/react-table';
import { fromOID } from './fromOID';
import { dateFromNow } from '../common/date/dateFromNow';
import { capitalize, decapitalize } from '../common/text/capitalize';
import { toDollarString } from './toDollarString';
import { toDateString } from './toDateString';
import { ofNumber } from './ofNumber';
import { toPercentageString } from './toPercentageString';
import { ofDate } from './ofDate';
import { toProperFromCamel } from '../common/text/toProperCase';

export const cleanup = (input: string) => ['?', '[', ']', '{', '}', '<', '>'].map((toReplace) => (s: string) => s.replaceAll(toReplace, '')).reduce((pv, cv) => cv(pv), input);

const isOneOf =
    (...listOfTypes: string[]) =>
    (str: string) =>
        listOfTypes.includes(cleanup(str));

// export class Def<T, TValue = any> {
//     backing: [DeepKeys<T>, JITTColumnDef<T, TValue>];
//     constructor(name: DeepKeys<T>, datatype: RealmTypes) {
//         this.backing = [name, { meta: { datatype } }];
//     }
//     static ctor<T, TValue = any>(name: DeepKeys<T>, datatype: RealmTypes = 'string'): Def<any, any> {
//         return new Def<T, TValue>(name, datatype);
//     }
//     $$(helper: ColumnHelper<T>): DefinedColumn {
//         const spread = this.backing[1].meta.accessorFn == null ? this.backing : [this.backing[1].meta.accessorFn, { ...this.backing[1], id: this.backing[0] }] as [any, any]
//         return helper.accessor(...spread);
//     }
//     $(helper: ColumnHelper<T>): DefinedColumn {
//         return helper.accessor((x: any) => this.backing[1].meta.accessorFn(x[this.backing[0]]), { ...this.backing[1], id: this.backing[0], header: `# ${toProperFromCamel(this.backing[0] as string ?? '')}` });
//     }
//     addToArray<TKey extends keyof ColumnMeta<T, TValue>, TArrayValue>(metaProperty: TKey, ...items: TArrayValue[]): Def<any, any> {
//         const next = [...(this.backing[1].meta[metaProperty] ?? []), ...items];
//         this.backing[1].meta[metaProperty] = next;
//         return this;
//     }
//     addToMeta<TKey extends keyof ColumnMeta<T, TValue>>(metaProperty: TKey, value: ColumnMeta<T, TValue>[TKey]): Def<any, any> {
//         this.backing[1].meta[metaProperty] = value;
//         return this;
//     }
//     addToDef<TKey extends JITTColumnDef<T, TValue>>(defProperty: TKey, value: JITTColumnDef<T, TValue>[TKey]): Def<any, any> {
//         this.backing[1][defProperty] = value;
//         return this;
//     }

//     setDataType(datatype: RealmTypes | 'linkingObjects'): Def<any, any> {
//         this.backing[1].meta.datatype = datatype;
//         return this;
//     }
//     displayName(name: string): Def<any, any> {
//         return this.addToDef('header', name).addToDef('footer', decapitalize(name.toLowerCase().split(' ').map(capitalize).join('')).replaceAll(' ', ''));
//     }
//     id(name: string): Def<any, any> {
//         return this.addToDef('id', name);
//     }
//     initializer(func: RealmInitializer): Def<any, any> {
//         return this.addToMeta('defaultValue', func);
//     }
//     defaultValue(value: ReturnType<RealmInitializer>): Def<any, any> {
//         return this.addToMeta('defaultValue', value);
//     }
//     required(): Def<any, any> {
//         return this.addToMeta('required', true);
//     }
//     readonly(): Def<any, any> {
//         return this.addToMeta('readonly', true);
//     }
//     enumMap<TKey extends string>(enumMap: EnumMap<TKey>): Def<any, any> {
//         return this.addToMeta('enumMap', enumMap);
//     }
//     objectType(ot: RealmTypes | RealmObjects): Def<any, any> {
//         console.log(`objectType`, ot);
//         return this.addToMeta(
//             'objectType',
//             isOneOf('int', 'double', 'decimal128', 'float', 'bool', 'string', 'date', 'data', 'objectId', 'uuid', 'enum', 'linkingObjects')(ot) ? ot : ($db[ot as RealmObjects]() as RealmObjects)
//         );
//     }
//     asLookup(objectType?: RealmObjects): Def<any, any> {
//         const result = this.setDataType('object');
//         if (objectType == null) return result.objectType(this.backing[0] as RealmObjects);
//         return result.objectType(objectType);
//     }
//     labelBy(label: string) {
//         return this.addToMeta('labelProperty', label);
//     }
//     setLookupProperty(key: string) {
//         return this.addToMeta('lookupProperty', key);
//     }
//     asEnum<TValue, TKey extends string = string, TKey2 extends string = string>(enumMap: EnumMap<TKey, TValue>, extraKey?: TKey2): Def<any, any> {
//         const extra = extraKey ? (x: Def<any, any>) => x.setLookupProperty(extraKey) : (x: Def<any, any>) => x;
//         return extra(this.setDataType('enum').enumMap(enumMap as any));
//     }
//     inputType(inputType: React.HTMLInputTypeAttribute): Def<any, any> {
//         return this.addToMeta('inputType', inputType);
//     }
//     checkbox(defaultValue = false) {
//         return this.addToMeta('defaultValue', defaultValue).inputType('checkbox').setDataType('bool').justify('center');
//     }
//     validator(...validators: Validator<TValue | undefined>[]): Def<any, any> {
//         return this.addToArray('validators', ...validators);
//     }
//     min(min: number): Def<any, any> {
//         const [_, curr2] = this.backing as [any, DefinedColumn];
//         const { datatype } = { ...{}, ...curr2.meta };
//         if (['int', 'decimal128', 'float', 'double'].includes(datatype ?? '')) {
//             return this.addToMeta('min', min);
//         }
//         return this.addToMeta('minLength', min);
//     }
//     pattern(pattern: RegExp): Def<any, any> {
//         return this.addToMeta('pattern', pattern);
//     }
//     multiple(): Def<any, any> {
//         return this.addToMeta('multiple', true);
//     }
//     max(max: number): Def<any, any> {
//         const [_, curr2] = this.backing as [any, DefinedColumn];
//         const { datatype } = { ...{}, ...curr2.meta };
//         if (['int', 'decimal128', 'float', 'double'].includes(datatype ?? '')) {
//             return this.addToMeta('max', max);
//         }
//         return this.addToMeta('maxLength', max);
//     }
//     int(defValue = 0): Def<any, any> {
//         return this.setDataType('int').defaultValue(defValue).inputType('number');
//     }
//     precision(precise = 2): Def<any, any> {
//         return this.addToMeta('precision', precise);
//     }
//     float(defValue = 0, precise = 4): Def<any, any> {
//         return this.setDataType('float').precision(precise).defaultValue(defValue).inputType('number');
//     }
//     multiplier(multi: number): Def<any, any> {
//         return this.addToMeta('multiplier', multi);
//     }
//     formatter(func: (x?: StringOr<TValue>) => string | undefined): Def<any, any> {
//         return this.addToMeta('formatString', func);
//     }
//     bool(defValue = false): Def<any, any> {
//         return this.setDataType('bool').defaultValue(defValue).inputType('checkbox');
//     }
//     collectionOf(collectionType: RealmCollectionTypes, ofType: RealmTypes | RealmObjects) {
//         const func =
//             collectionType === 'list'
//                 ? (x: DBList<any>) => x.length
//                 : collectionType === 'dictionary'
//                 ? (x: DBDictionary<any>) => Array.from(x.keys()).length
//                 : collectionType === 'set'
//                 ? (x: DBSet<any>) => x.size
//                 : (x: DBBacklink<any>) => x.length;
//         return this.setDataType(collectionType).accessorFn(func).objectType(ofType).readonly();
//     }
//     accessorFn(func: (x: T) => TValue) {
//         const [curr, curr2] = this.backing;

//         return this.addToMeta('accessorFn', func);
//     }
//     list(ofType: RealmTypes | RealmObjects) {
//         return this.collectionOf('list', ofType)
//             .disableEditing();;
//     }
//     dictionary(ofType: RealmTypes | RealmObjects) {
//         return this.collectionOf('dictionary', ofType)
//             .disableEditing();;
//     }
//     enableEditing() {
//         return this.addToMeta('enableEditing', true);
//     }

//     disableEditing() {
//         return this.addToMeta('enableEditing', false);
//     }
//     set(ofType: RealmTypes | RealmObjects) {
//         return this.collectionOf('set', ofType)
//             .disableEditing();
//     }
//     backlink(ofType: RealmTypes | RealmObjects) {
//         return this.collectionOf('linkingObjects', ofType);
//     }
//     url(): Def<any, any> {
//         return this.setDataType('string').inputType('url');
//     }
//     email(): Def<any, any> {
//         return this.setDataType('string').inputType('email');
//     }
//     pre<TInput, TOutput>(...pre: PreProcessFunction<TInput, TOutput>[]) {
//         return this.addToArray('preprocess', ...pre);
//     }
//     tel(): Def<any, any> {
//         return this.setDataType('string').inputType('tel');
//     }
//     // zipcode() {}
//     barcode() {
//         return this.setDataType('string')
//             .max(13)
//             .min(13)
//             .pattern(/^[0-9]{13}$/)
//             .formatter((x: string) => {
//                 const ch = x.split('');
//                 return [ch[0], ch[1], ch.slice(2, 7).join(''), ch.slice(7, 12).join(''), ch[12]].join('-')
//             })
//             .inputType('text');
//     }
//     justify(s: string) {
//         return this.addToMeta('justify', ['justify', s].join('-') as any)
//     }
//     chip(colorMap: Record<string, string>) {
//         return this.addToMeta('colorMap', colorMap).justify('center');
//     }
//     asDate(dateOnly = false, initialNow = false) {
//         const result = this.setDataType('date')
//             .inputType(dateOnly ? 'date' : 'datetime-local')
//             .pre(ofDate)
//             .formatter(toDateString);
//         return initialNow ? result.initializer(dateFromNow) : result;
//     }
//     percentage(min?: number, max?: number): Def<any, any> {
//         const result = this.float(0, 4).multiplier(100).pre(ofNumber).formatter(toPercentageString);
//         const apply1 = min ? (x: Def<any, any>) => x.min(min) : (x: Def<any, any>) => x;
//         const apply2 = max ? (x: Def<any, any>) => x.max(max) : (x: Def<any, any>) => x;
//         return apply1(apply2(result));
//     }
//     dollar(canBeNegative = false) {
//         const result = canBeNegative ? this : this.min(0);
//         return result.setDataType('float').precision(2).pre(ofNumber).formatter(toDollarString);
//     }
//     static OID<T>(helper: ColumnHelper<any>): DefinedColumn {
//         return helper.accessor((x) => fromOID(x._id), {
//             id: '_id',
//             header: 'ID',
//             maxSize: 15,
//             meta: { justify: 'justify-center', datatype: 'objectId', required: true, readonly: true, defaultValue: () => new BSON.ObjectId() }
//         }) as ColumnDef<T, BSON.ObjectId>;
//     }
// }

