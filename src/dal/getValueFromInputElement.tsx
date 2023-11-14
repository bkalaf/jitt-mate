import { BSON } from 'realm';
import { toOID } from './toOID';
import { fromOID } from './fromOID';
import { chunkBy } from '../common/array/chunkBy';
import { identity } from '../common/functions/identity';

export function getValueFromInputElement(el: HTMLInputElement) {
    return el.value;
}
export function setInputElementDefaultValue(el: HTMLInputElement, value?: string) {
    el.defaultValue = value ?? '';
}
export function getValueAsNumberFromInputElement(el: HTMLInputElement) {
    return el.valueAsNumber;
}
export function getValueAsDateFromInputElement(el: HTMLInputElement) {
    return el.valueAsDate;
}
export function getSelectedOptionsFromSelectElement<T>(lookup: (x: string) => T, multiple = false) {
    return function (el: HTMLSelectElement) {
        const objs = Array.from(el.selectedOptions).map((x) => lookup(x.value));
        return multiple ? objs : objs[0];
    };
}
export function setInputElementDefaultChecked(el: HTMLInputElement, value = false) {
    return (el.defaultChecked = value);
}
export function getCheckedFromInputElement(el: HTMLInputElement) {
    return el.checked;
}

export type DecoratorOptions<T, TKey extends keyof T = keyof T> = {
    required?: boolean;
    immutable?: boolean;
    objectType?: RealmObjects;
    defaultValue?: T[TKey];
    initializer?: () => Promise<T[TKey]>;
    calculation?: (x: T) => T[TKey];
    precision?: number;
    step?: number;
    multiple?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    prefix?: string;
    suffix?: string;
    enumMap?: Record<string, string | { text: string; color: string }>;
    elementInfo?:
        | {
              tagName: 'input';
              type?: React.HTMLInputTypeAttribute;
          }
        | {
              tagName: 'select';
              type?: 'dropdown' | 'lookup';
          }
        | {
              tagName: 'textarea';
          };
};
export type DecoratorContexts = ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassMethodDecoratorContext;

export function testExist(obj?: any): AnyObject {
    obj ??= {};
    return obj;
}
export function toLookup(rec: Record<string, string | { text: string; color: string }>, key: 'text' | 'color' = 'text') {
    return (x: string) => {
        const result = rec[x];
        return typeof result === 'string' ? result : result[key];
    };
}
// export function decoratorBase<T, TKey extends keyof T & string, TValue>(datatype: RealmTypes | RealmObjects, opts: DecoratorOptions<T, TKey>) {
//     function innerDecorator(target: T, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext): void;
//     function innerDecorator(target: T[TKey], context: ClassMethodDecoratorContext): T[TKey];
//     function innerDecorator(target: T | T[TKey], context: DecoratorContexts): void | T[TKey] {
//         const fields = testExist(context.metadata.fields);
//         const calculatedFields = testExist(context.metadata[Symbol.calculatedFields]);
//         const convertToRealm = testExist(context.metadata[Symbol.convertToRealm]);
//         const convertFromRealm = testExist(context.metadata[Symbol.convertFromRealm]);
//         const getValues = testExist(context.metadata[Symbol.getValues]);
//         const setValues = testExist(context.metadata[Symbol.setValues]);
//         const setDefaultValues = testExist(context.metadata[Symbol.setDefaultValues]);

//         const init = testExist(context.metadata[Symbol.init]);
//         const name = context.name.toString() as TKey;
//         const { defaultValue, initializer, calculation, elementInfo, enumMap, prefix, suffix, pattern } = opts;
//         let { precision, step, required, immutable, multiple, min, max, objectType } = opts;
//         let { tagName, type } = { ...{ tagName: 'input', type: 'text' }, ...(elementInfo ?? {}) };
//         let readOnly: boolean | undefined;
//         let ariaReadOnly: boolean | undefined;
//         let minLength, maxLength, list, children, columns;
//         const formatters = [];
//         switch (datatype) {
//             case 'string': {
//                 const fieldConvertTo = (x?: Optional<string>) => (x == null || x.length === 0 ? undefined : x);
//                 const fieldConvertFrom = (x?: Optional<string>) => (x == null || x.length === 0 ? undefined : x);
//                 const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 readOnly = immutable;
//                 maxLength = max;
//                 max = undefined;
//                 minLength = min;
//                 min = undefined;
//                 break;
//             }
//             case 'int': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<number> => (x == null || x.length === 0 ? undefined : parseInt(x, 10));
//                 const fieldConvertFrom = (x?: Optional<number>) => (x == null ? undefined : x.toFixed(0));
//                 const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 type = 'number';
//                 precision = 0;
//                 step = 1;
//                 readOnly = immutable;
//                 break;
//             }
//             case 'double':
//             case 'float':
//             case 'decimal128': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<number> => (x == null || x.length === 0 ? undefined : parseFloat(x));
//                 const fieldConvertFrom = (x?: Optional<number>) => (x == null ? undefined : x.toFixed(precision ?? 4));
//                 const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 precision ??= 4;
//                 step ??= 1 / (10 ^ precision);
//                 type = 'number';
//                 readOnly = immutable;
//                 break;
//             }
//             case 'objectId': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<BSON.ObjectId> => toOID(x);
//                 const fieldConvertFrom = (x?: Optional<BSON.ObjectId>) => fromOID(x);
//                 const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 getValues[name] = getValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 required = true;
//                 immutable = true;
//                 formatters.push((x: Optional<string>) =>
//                     x != null && x.length > 0
//                         ? chunkBy<string>(4)(x.split(''))
//                               .map((x) => x.join(''))
//                               .join('')
//                         : ''
//                 );
//                 readOnly = immutable;
//                 break;
//             }
//             case 'bool': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<boolean> => (x == null || x.length === 0 ? undefined : x === 'true' ? true : x === 'false' ? false : undefined);
//                 const fieldConvertFrom = (x?: Optional<boolean>) => x;
//                 const setValue = (el: HTMLInputElement, value: boolean) => (el.checked = value);
//                 const getValue = (obj: T): string => (obj[name] ?? false) as string;
//                 const setDefaultValue = (el: HTMLInputElement, value: boolean) => (el.defaultChecked = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 getValues[name] = getValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 type = 'checkbox';
//                 readOnly = immutable;
//                 break;
//             }
//             case 'uuid': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<BSON.UUID> => (x == null || x.length === 0 ? undefined : new BSON.UUID(x));
//                 const fieldConvertFrom = (x?: Optional<BSON.UUID>) => x?.toHexString(true);
//                 const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 getValues[name] = getValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 readOnly = immutable;
//                 break;
//             }
//             case 'date': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<Date> => (x == null || x.length === 0 ? undefined : new Date(Date.parse(x)));
//                 const fieldConvertFrom = (x?: Optional<Date>) => x?.toLocaleString();
//                 const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 getValues[name] = getValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 type = 'datetime-local';
//                 readOnly = immutable;
//                 break;
//             }
//             case 'data': {
//                 const fieldConvertTo = (x?: Optional<string>): Optional<ArrayBuffer> => (x == null || x.length === 0 ? undefined : Buffer.from(x));
//                 const fieldConvertFrom = (x?: Optional<ArrayBuffer>) => undefined;
//                 const setValue = (el: HTMLInputElement, value: string) => {
//                     return;
//                 };
//                 const getValue = (obj: T): Optional<string> => {
//                     return undefined;
//                 };
//                 const setDefaultValue = (el: HTMLInputElement, value: string) => {
//                     return;
//                 };
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 getValues[name] = getValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 type = 'file';
//                 break;
//             }
//             case 'enum': {
//                 const fieldConvertTo = (x?: Optional<string>) => (x == null || x.length === 0 ? undefined : x);
//                 const fieldConvertFrom = (x?: Optional<string>) => x;
//                 const setValue = (el: HTMLSelectElement, value: string) => {
//                     const option = Array.from(el.options).find((x) => x.value === value);
//                     if (option) {
//                         option.toggleAttribute('selected');
//                     }
//                 };
//                 const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                 const setDefaultValue = (el: HTMLSelectElement, value: string | string[]) => {
//                     const options = Array.from(el.options).filter((x) => (Array.isArray(value) ? value : [value]).includes(x.value));
//                     if (options && Array.from(options).length > 0) {
//                         options.map((option) => option.toggleAttribute('selected'));
//                     }
//                 };
//                 convertFromRealm[name] = fieldConvertFrom;
//                 convertToRealm[name] = fieldConvertTo;
//                 setValues[name] = setValue;
//                 getValues[name] = getValue;
//                 setDefaultValues[name] = setDefaultValue;
//                 tagName = 'select';
//                 type = 'dropdown';
//                 formatters.push(toLookup(enumMap ?? {}));
//                 ariaReadOnly = immutable;
//                 children = Object.entries(enumMap ?? {}).map(([k, v], ix) => <option key={ix} label={typeof v === 'string' ? v : v.text} value={k} />);
//                 break;
//             }

//             case 'object': {
//                 const isLookup = [
//                     'mercariBrand',
//                     'mercariCategory',
//                     'mercariSubCategory',
//                     'mercariSubSubCategory',
//                     'brand',
//                     'classifier',
//                     'product',
//                     'sku',
//                     'productImage',
//                     'locationSegment',
//                     'hashTag',
//                     'rn'
//                 ].includes(objectType ?? '');
//                 switch (isLookup) {
//                     case true: {
//                         const fieldConvertTo = (x?: Optional<string>): Optional<any> => (x == null || (typeof x === 'string' && x.length === 0) ? undefined : (typeof x === 'string' || x instanceof BSON.ObjectId) ? window.$$store?.objectForPrimaryKey(objectType ?? '', fromOID(x)) : x);
//                         const fieldConvertFrom = (x?: Optional<EntityBase>) => fromOID(x?._id);
//                         const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                         const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                         const setDefaultValue = (el: HTMLInputElement, value: string) => { return; };
//                         convertFromRealm[name] = fieldConvertFrom;
//                         convertToRealm[name] = fieldConvertTo;
//                         setValues[name] = setValue;
//                         getValues[name] = getValue;
//                         setDefaultValues[name] = setDefaultValue;
//                         tagName = 'select';
//                         type = 'lookup';
//                         list = `${name}-datalist`;
//                         break;
//                     }
//                     case false: {
//                         const Ctor: any = window.$$store?.schema.find(x => x.name === objectType);
//                         const nameParts = name.split('.');
//                         const columns = (Ctor as any).columns(...nameParts);
//                         const $metadata = Ctor[Symbol.metadata];
//                         const fieldConvertTo = (x?: AnyObject): Optional<any> => (x == null || x.length === 0 ? undefined : Object.fromEntries(Object.entries(x).map(([k, v]) => [k, $metadata[Symbol.convertToRealm][k](v)])));
//                         const fieldConvertFrom = (x?: AnyObject) => Object.fromEntries(Object.entries(x ?? {}).map(([k, v]) => [k, $metadata[Symbol.convertFromRealm][k](v)]));
//                         const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                         const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                         const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                         convertFromRealm[name] = fieldConvertFrom;
//                         convertToRealm[name] = fieldConvertTo;
//                         setValues[name] = setValue;
//                         getValues[name] = getValue;
//                         setDefaultValues[name] = setDefaultValue;
//                         tagName = 'select';
//                         type = 'lookup';
//                         break;
//                         break;
//                     }
//                 }
//                 // const fieldConvertTo = (x?: Optional<string>): Optional<any> => (x == null || x.length === 0 ? undefined : new Date(Date.parse(x)));
//                 // const fieldConvertFrom = (x?: Optional<Date>) => x?.toLocaleString();
//                 // const setValue = (el: HTMLInputElement, value: string) => (el.value = value);
//                 // const getValue = (obj: T): string => (obj[name] ?? '') as string;
//                 // const setDefaultValue = (el: HTMLInputElement, value: string) => (el.defaultValue = value);
//                 // convertFromRealm[name] = fieldConvertFrom;
//                 // convertToRealm[name] = fieldConvertTo;
//                 // setValues[name] = setValue;
//                 // getValues[name] = getValue;
//                 // setDefaultValues[name] = setDefaultValue;
//                 // tagName = 'select';
//                 // type = 'lookup';
//                 break;
//             }
//             case 'list':
//             case 'dictionary':
//             case 'set':
//             case 'mercariBrand':
//             case 'mercariCategory':
//             case 'mercariSubCategory':
//             case 'mercariSubSubCategory':
//             case 'brand':
//             case 'classifier':
//             case 'product':
//             case 'sku':
//             case 'listing':
//             case 'draft':
//             case 'productImage':
//             case 'scan':
//             case 'locationSegment':
//             case 'hashTag':
//             case 'hashTagUsage':
//             case 'rn':
//             case 'customItemField':
//             case 'barcode':
//             case 'address':
//             case 'productTaxonomy':
//             case 'measurements':
//             case 'flags':
//             case 'madeOf':
//             case 'dimensions':
//         }
//         switch (context.kind) {
//             case 'method': {
//                 if (calculation) {
//                     calculatedFields[name] = (x: T) => (x[name] = calculation(x));
//                 }
//                 break;
//             }
//             case 'field':
//             case 'getter': {
//                 const dv: () => Promise<T[TKey] | undefined> = (initializer ?? defaultValue ? () => Promise.resolve(defaultValue) : undefined) ?? (() => Promise.resolve(undefined));
//                 formatters.push((x: string) => [prefix, x, suffix].filter((x) => x != null).join(''));
//                 const formatter = formatters.reduce(
//                     (pv, cv) => (x: string) => {
//                         return cv(pv(x));
//                     },
//                     (x: string) => x
//                 );
//                 init[name] = dv;
//                 fields[name] = {
//                     datatype,
//                     required,
//                     immutable,
//                     multiple,
//                     formatter,
//                     tagName,
//                     type,
//                     inputProps: {
//                         name,
//                         id: `${name}-${tagName}`,
//                         'aria-labelledby': `${name}-${tagName}-label`,
//                         required,
//                         readOnly,
//                         type: tagName === 'input' ? type : undefined,
//                         'aria-readonly': ariaReadOnly,
//                         multiple,
//                         step,
//                         maxLength,
//                         minLength,
//                         max,
//                         min,
//                         pattern: pattern?.toString().slice(1, pattern.toString().length - 2),
//                         children: children ?? null
//                     }
//                 };
//                 break;
//             }
//         }
//     }
// }
