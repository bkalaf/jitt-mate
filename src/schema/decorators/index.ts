import Realm, { BSON } from 'realm';
import { konst } from '../../common/functions/konst';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { fromOID } from '../../dal/fromOID';
import { toOID } from '../../dal/toOID';
import { dateFromNow } from '../../common/date/dateFromNow';
import { identity } from '../../common/functions/identity';
import { normalizeSchemaProperty } from '../../dal/normalizeSchemaProperty';
import { ignore } from '../../common/functions/ignore';
import { _ } from '../../metadata/decorators/_';

const fromControl = {
    checkbox: (el: HTMLInputElement) => el.checked,
    radio: (els: HTMLInputElement[]) => els.find(x => x.checked)?.value,
    select: (el: HTMLSelectElement) => Array.from(el.selectedOptions).map(x => x.value),
    datalist: (el: HTMLInputElement) => el.value,
    numberInput: (el: HTMLInputElement) => el.valueAsNumber,
    dateInput: (el: HTMLInputElement) => el.valueAsDate,
    textInput: (el: HTMLInputElement) => el.value,
    textareaElement: (el: HTMLTextAreaElement) => el.value,
};
const setDefaultOrInitalValue = {
    checkbox: (el: HTMLInputElement, value = false) => el.defaultChecked = value,
    radio: (el: HTMLInputElement[], value: string) => el.find(x => x.value === value)?.toggleAttribute('checked'),
    select: (el: HTMLSelectElement, value: string) => Array.from(el.options).find(x => x.value === value)?.toggleAttribute('selected'),
    datalist: (el: HTMLInputElement, value: string) => Array.from(el.list?.options ?? []).find(x => x.value === value)?.toggleAttribute('selected'),
    numberDateStringInput: (el: HTMLInputElement, value: Date | number | string) => el.defaultValue = value.toString(),
    textAreaElement: (el: HTMLTextAreaElement, value?: string) => el.defaultValue = value ?? ''
};
export type MetaAttributes<T extends EntityBase, TKey extends keyof T, TJavaScriptType extends T[TKey], TEnumKeys extends string = never> = {
    datatype: RealmTypes | RealmObjects;
    tagName: 'input' | 'select' | 'textarea';
    inputType: Optional<React.HTMLInputTypeAttribute>;
    required?: boolean;
    readOnly?: boolean;
    getElementValue: (el: HTMLElement) => TJavaScriptType;
    setElementDefault: (el: HTMLElement, value?: TJavaScriptType) => void;
    initializer: () => TJavaScriptType;
    parse: (x?: string | boolean | number) => TJavaScriptType;
    toUI: (x?: TJavaScriptType) => string | boolean;
    accessorKey?: TKey;
    accessorFn?: (original: T) => TJavaScriptType;
    id?: TKey;
    header: string;
    tooltip: (original: T) => string;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
    pattern?: RegExp | string;
    step?: number;
    precision?: 0 | 1 | 2 | 3 | 4;
    indexed?: boolean;
    multiple?: boolean;
    objectType?: RealmTypes | RealmObjects;
    columns?: DefinedColumns;
    edittingEnabled?: boolean;
    labelProperty?: keyof T;
    lookupProperty?: string;
    enumMap?: EnumMap<TEnumKeys>;
    colorMap?: Record<TEnumKeys, string>;
    lookupFilters: [string, any[]][];
    decimalToFractions?: boolean;
    prefixedText?: string;
    suffixedText?: string;
    multiplier?: number;
    selectType?: 'radio' | 'select' | 'datatlist';
    // fieldType: 'address' | 'bool' | 'currency' | 'date-time' | 'date' | 'dbRef' | 'int' | 'float' | 'percent' |  'phone' | 'email' | 'url' | 'pick-list' | 'multi-picklist' | 'text' | 'text-area' | 'duration' | 'bin-data' | 'barcode';
};

type T = string extends (string | number) ? string : never;
export function buildColumns<T extends EntityBase, TKey extends keyof T, TJavaScriptType extends T[TKey], TElement = DataControlElements, TEnumKeys extends string = never>(meta: MetaAttributes<T, TKey, TJavaScriptType, TEnumKeys>) {
    const { datatype, getElementValue, header, initializer, inputType, indexed, lookupFilters, multiple, labelProperty, lookupProperty, step, parse, setElementDefault, tagName, toUI, tooltip, accessorFn, accessorKey, min, max, minLength, maxLength, colorMap, columns, decimalToFractions, edittingEnabled, enumMap, multiplier, suffixedText, precision, prefixedText, selectType, readOnly, required, pattern, objectType, id } = meta;

    const $precision = datatype === 'int' ? 0 : ['double', 'decimal128', 'float'].includes(datatype) ? precision ?? 4 : 2;
    const stringify = (v?: T[TKey] | null): boolean | string | null => {
        if (v == null) {
            return '';
        }
        switch (typeof v) {
            case 'string':
                return v.length === 0 ? null : v;
            case 'number':
                return v.toFixed($precision);
            case 'bigint':
                return v.toString();
            case 'boolean':
                return v;
            case 'object':
                return labelProperty ? (v as Record<keyof T, any>)[labelProperty] : null;

            default:
                throw new Error(`COULD NOT STRINGIFY: ${JSON.stringify(v)}`);
        }
    };
    // const parseValue = (str: Date | boolean | string | null): ReturnType<RealmInitializer> | null => {
    //     switch (datatype as RealmTypes) {
    //         case
    //         case 'bool':
    //             return str == null ? null : typeof str === 'boolean' ? str : typeof str === 'string' && str.length > 0 ? str === 'true' ? true : str === 'false' ? false : null : null;
    //         case 'date':
    //             return str == null ? null : str instanceof Date ? str : new Date((typeof str === 'string' ? Date.parse(str) : typeof str === 'number' ? str : null) ?? 0);
    //         case 'int':
    //             return str == null ? null : typeof str === 'string' ? str.length === 0 ? null : parseInt(str, 10) : typeof str === 'number' ? str : null;
    //         case 'double':
    //         case 'decimal128':
    //         case 'float':
    //             return str == null ? null : typeof str === 'string' ? str.length === 0 ? null : parseFloat(str) : typeof str === 'number' ? str : null;
    //         case 'objectId':
    //             return str != null ? str instanceof BSON.ObjectId ? str : typeof str === 'string' ? new BSON.ObjectId(str) : null : null;
    //         case 'uuid':
    //             return str != null ? str instanceof BSON.UUID ? str : typeof str === 'string' ? new BSON.UUID(str) : null : null;
    //         default:
    //             break;
    //     }
    // };

    // // v == null ? '' : typeof v === 'string' ? v.length === 0 ? '' : v : typeof v === 'boolean' ? v : typeof v === 'number' ? v.toFixed(datatype === 'int' ? 0 : datatype === 'float' || datatype === 'double' || datatype === 'decimal128' ? 4 : 2) : typeof v === 
    // const rowToElement = (original: T, el: TElement): void => {
    //     const v = accessorKey ? original[accessorKey] : accessorFn ? accessorFn(original) : null;
    //     switch (tagName) {
    //         case 'textarea':
    //             (el as HTMLTextAreaElement).defaultValue = v ?? '';
    //         case 'select':

    //         case 'input':
    //             break;

    //         default:
    //             break;
    //     }
    // };
    // const rowToCell = (original: T): string | null => null;
    // const elementToCell = (el: TElement): string | null => null;

    // const loadDefaults = (original: T, el: TElement): void => void 0;
    // const initialize = (): TJavascriptType | null => null;
}

    const init = function (context: ClassFieldDecoratorContext) {
    if (context.metadata[context.name] == null) {
        context.metadata[context.name] = {} as any;
    }
    return context.metadata[context.name] as Record<string, any>;
};
export const $meta = {
    datatype($datatype: RealmTypes, $objectType?: RealmObjects | RealmTypes) {
        return function (_target: any, context: ClassFieldDecoratorContext<EntityBase, any>) {
            init(context).datatype = $datatype;
            switch ($datatype) {
                case 'list':
                case 'dictionary':
                case 'set': {
                    const getLength = 'list' === $datatype ? (x: DBList<any>) => x.length : 'dictionary' === $datatype ? (x: DBDictionary<any>) => Array.from(x.keys()).length : $datatype === 'set' ? (x: DBSet<any>) => x.size : konst(0);
                    _(context).isCollection = true;
                    _(context).id = context.name;
                    _(context).initializer = () => 'list' === $datatype || 'set' === $datatype ? Promise.resolve([]) : Promise.resolve({});
                    _(context).accessorFn = (orig: any) => _(context).toUI(orig[context.name]);
                    _(context).getLength = getLength;
                    _(context).readOnly = true;
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).toUI = (value: DBSet<any> | DBDictionary<any> | DBList<any>) => _(context).getLength(value);
                    break;
                }
                case 'bool':
                    _(context).valueProperty = (el: HTMLElement) => (el as HTMLInputElement).checked;
                    _(context).defaultValueProperty = (el: HTMLElement, value?: boolean) => (el as HTMLInputElement).defaultChecked = value ?? false;
                    _(context).inputType = 'checkbox';
                    _(context).tagName = 'input';
                    _(context).accessorFn = (orig: any) => _(context).toUI(orig[context.name]);
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).parse = (x?: string) => x != null ? x === 'true' ? true : x === 'false' ? false : undefined : undefined;
                    _(context).toUI = (value?: boolean) => value;
                    break;
                case 'string':
                    _(context).valueProperty = (el: HTMLElement) => (el as HTMLInputElement).value;
                    _(context).defaultValueProperty = (el: HTMLElement, value?: string) => (el as HTMLInputElement).defaultValue = value ?? '';
                    _(context).inputType = 'text';
                    _(context).tagName = () => _(context).maxLength == null || _(context).maxLength <= 175 ? 'input' : 'textarea';
                    _(context).rows = () => {
                        const v = (_(context).maxLength ?? 750) / 250;
                        return v <= 6 ? v >= 3 ? v : 3 : 6;
                    };
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).parse = (x?: string) => x != null ? x.length === 0 ? undefined : x : undefined;
                    _(context).trim = true;
                    _(context).prefix = '';
                    _(context).suffix = '';
                    _(context).monoid = identity;
                    _(context).toUI = (x?: string) => {
                        const v = _(context).parse(x);
                        return v == null || v.length === 0 ? undefined : _(context).trim ? _(context).monoid([_(context).prefix, v, _(context).suffix].join('')).trim() : _(context).monoid([_(context).prefix, v, _(context).suffix].join(''));
                    };
                    break;
                case 'date':
                    _(context).valueProperty = (el: HTMLElement) => (el as HTMLInputElement).valueAsDate ?? undefined;
                    _(context).defaultValueProperty = (el: HTMLElement, value?: Date | number | string) => (el as HTMLInputElement).defaultValue = value != null ? value instanceof Date ? value.toLocaleString() : typeof value === 'number' ? new Date(value).toLocaleString() : new Date(Date.parse(value)).toLocaleString() : '';
                    _(context).inputType = 'datetime-local';
                    _(context).tagName = 'input';
                    _(context).defaultNow = false;
                    _(context).initializer = () => Promise.resolve(dateFromNow());
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).parse = (x?: string) => x != null && x.length > 0 ? new Date(Date.parse(x)) : undefined;
                    _(context).toUI = (x?: Date) => x?.toLocaleString();
                    break;
                case 'objectId':
                    _(context).valueProperty = (el: HTMLElement) => toOID((el as HTMLInputElement).value);
                    _(context).defaultValueProperty = (el: HTMLElement, value?: OID) => (el as HTMLInputElement).defaultValue = fromOID(value) ?? '';
                    _(context).inputType = 'text';
                    _(context).tagName = 'input';
                    _(context).required = true;
                    _(context).readOnly = true;
                    _(context).initializer = () => Promise.resolve(new BSON.ObjectId());
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).parse = (x?: string) => toOID(x);
                    _(context).toUI = (x?: BSON.ObjectId | string) => toOID(x)?.toHexString();
                    break;
                case 'uuid':
                    _(context).valueProperty = (el: HTMLElement) => {
                        const v = (el as HTMLInputElement).value;
                        return v != null && v.length > 0 ? new BSON.UUID(v) : undefined;
                    };
                    _(context).defaultValueProperty = (el: HTMLElement, value?: BSON.UUID | string) => (el as HTMLInputElement).defaultValue = value != null ? typeof value === 'string' ? value.length > 0 ? value : '' : value.toHexString() : '';
                    _(context).inputType = 'text';
                    _(context).tagName = 'input';
                    _(context).initializer = () => Promise.resolve(new BSON.UUID());
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).parse = (x?: string | BSON.UUID) => x != null ? typeof x === 'string' ? x.length > 0 ? new BSON.UUID(x) : undefined : x : undefined;
                    _(context).toUI = (x?: BSON.UUID | string) => x != null ? x instanceof BSON.UUID ? x.toHexString(true) : x.length > 0 ? new BSON.UUID(x).toHexString(true) : undefined : undefined;
                    break;
                case 'decimal128':
                case 'double':
                case 'float':
                    _(context).precision = 2;
                    _(context).inputType = 'number';
                    _(context).tagName = 'input';
                    _(context).step = 1 / (10 ^ _(context).precision);
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).valueProperty = (el: HTMLElement) => (el as HTMLInputElement).valueAsNumber;
                    _(context).defaultValueProperty = (el: HTMLElement, value?: number | string) => (el as HTMLInputElement).defaultValue = (value != null ? typeof value === 'string' ? value.length > 0 ? value : undefined : value.toFixed(_(context).precision) : value) ?? '';
                    _(context).parse = (x?: string | number) => x != null ? typeof x === 'string' ? x.length > 0 ? parseFloat(x) : undefined : x : undefined;
                    _(context).multiplier = 1;
                    _(context).trim = true;
                    _(context).prefix = '';
                    _(context).suffix = '';
                    _(context).monoid = identity;
                    _(context).toUI = (x?: number | string) => {
                        const v = _(context).parse(x);
                        if (v == null) return '';
                        const w = _(context).monoid([_(context).prefix, (v * _(context).multiplier).toFixed(_(context).precision), _(context).suffix].join(''));
                        return _(context).trim ? w?.trim() : w;
                    };
                    break;
                case 'int':
                    _(context).precision = 0;
                    _(context).inputType = 'number';
                    _(context).tagName = 'input';
                    _(context).step = 1;
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).valueProperty = (el: HTMLElement) => (el as HTMLInputElement).valueAsNumber;
                    _(context).defaultValueProperty = (el: HTMLElement, value?: number | string) => (el as HTMLInputElement).defaultValue = (value != null ? typeof value === 'string' ? value.length > 0 ? value : undefined : value.toFixed(_(context).precision) : value) ?? '';
                    _(context).parse = (x?: string | number) => x != null ? typeof x === 'string' ? x.length > 0 ? parseInt(x, 10) : undefined : x : undefined;
                    _(context).multiplier = 1;
                    _(context).trim = true;
                    _(context).prefix = '';
                    _(context).suffix = '';
                    _(context).monoid = identity;
                    _(context).toUI = (x?: number | string) => {
                        const v = _(context).parse(x);
                        if (v == null) return '';
                        const w = _(context).monoid([_(context).prefix, (v * _(context).multiplier).toFixed(_(context).precision), _(context).suffix].join(''));
                        return _(context).trim ? w?.trim() : w;
                    };
                    break;
                case 'enum': {
                    _(context).enumMap = {} as EnumMap<string>;
                    _(context).extractFromEnumValue = identity;
                    _(context).colorMap = undefined;
                    _(context).optionCount = () => Object.keys(_(context).enumMap).length;
                    _(context).tagName = () => _(context).optionCount >= 8 ? 'select' : 'input';
                    _(context).inputType = () => _(context).optionCount >= 8 ? undefined : 'radio';
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).toUI = (x?: string) => x == null || x.length === 0 ? undefined : _(context).extractFromEnumValue(_(context).enumMap[x]);
                    _(context).valueProperty = (el: HTMLElement) => {
                        if (_(context).tagName === 'select') {
                            const opts = (el as HTMLSelectElement).selectedOptions;
                            if (opts.length === 0) return undefined;
                            const opt = opts[0];
                            return opt;
                        }
                        if ((el as HTMLInputElement).list != null) {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            const list = (el as HTMLInputElement).list!;
                            const selectedOpts = Array.from(list.options).filter(x => x.selected);
                            if (selectedOpts.length === 0) return undefined;
                            return selectedOpts[0];
                        }
                        if (_(context).inputType !== 'radio') {
                            const ele: HTMLInputElement | undefined = Array.from(document.querySelectorAll(`[name="${context.name.toString()}"]`)).find(x => (x as HTMLInputElement).checked) as HTMLInputElement | undefined;
                            return ele?.value;
                        }
                        throw new Error('bad valueProperty');
                    };
                    _(context).defaultValueProperty = (el: HTMLElement, value?: string) => _(context).tagName === 'select' ? Array.from((el as HTMLSelectElement).options).find(x => x.value === value)?.setAttribute('selected', 'true') : _(context).inputType === 'text' ? Array.from((el as HTMLInputElement).list?.options ?? []).find(x => x.value === value)?.setAttribute('selected', 'true') : Array.from(document.querySelectorAll(`input[name="${(el as HTMLInputElement).name ?? ''}"]`)).find((x: Element) => (x as HTMLInputElement).value === value)?.toggleAttribute('checked');
                    break;
                }
                case 'object': {
                    (context as ClassFieldDecoratorContext<Realm.Object<EntityBase> & EntityBase, Realm.Object<EntityBase> & EntityBase>).addInitializer(function (this: Realm.Object<EntityBase> & EntityBase) {
                        const propType = this.getPropertyType(context.name.toString());
                        console.log('propType');
                        _(context).objectType = propType;
                        const ctor: EntityConstructor<EntityBase> = this.constructor as unknown as any;
                        console.log('ctor', ctor);
                        _(context).labelProperty = ctor.labelProperty;
                        _(context).embeddedColumns = ctor.embeddedColumns;
                        _(context).schema = ctor.schema;
                        const { objectType: objectType2 } = normalizeSchemaProperty(ctor.schema.properties[context.name.toString()]);
                        console.log(`2nd objectType`, objectType2);
                        _(context).dropdownOptions = window.$$store?.objects(propType).map(obj => ({ value: obj._objectKey(), label: obj[_(context).labelProperty], obj }));
                        _(context).lookupByOID = Object.fromEntries((_(context).dropdownOptions as Array<{ value: string, label: string, obj: Realm.Object; }>).map(({ value, label, obj }) => [value, [label, obj]] as [string, [string, Realm.Object]]));
                    });
                    _(context).inputType = 'input';
                    _(context).datalist = `${_(context).objectType}-datalist`;
                    _(context).accessorKey = context.name.toString();
                    _(context).header = toProperFromCamel(context.name.toString());
                    _(context).valueProperty = (el: HTMLElement) => {
                        const ele = el as HTMLInputElement;
                        const opts = Array.from(ele.list?.options ?? []).filter(x => x.selected);
                        return opts.map(x => _(context).lookupByOID[x.value]).map(x => x[1])[0] as Realm.Object;
                    };
                    break;
                }
                case 'data':
                    throw new Error('unimplemented: data');
                default:
                    throw new Error('bad datatype');
                    break;
            }
            if ($objectType) {
                init(context).objectType = $objectType;
            }
        };
    }
};

export default $meta;