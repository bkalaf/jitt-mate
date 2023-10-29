import Realm, { BSON, SortDescriptor, ObjectSchema } from 'realm';
import { ColumnDef } from '@tanstack/react-table';
import { UseMutateFunction } from '@tanstack/react-query';

declare global {
    export type OID = BSON.ObjectId | string;
    export type Updater<T> = (x: T) => T;
    export type Len1<TArr extends any[]> = ((...args: TArr) => any) extends (...[x, ...args]: [any, ...infer R]) => any ? R['length'] : never;
    export type Last<TArr extends any[]> = TArr[Len1<TArr>];
    export type EntityBase = { _id: OID };
    export type RealmTypes = 'objectId' | 'uuid' | 'string' | 'int' | 'double' | 'float' | 'decimal128' | 'bool' | 'object' | 'date' | 'data' | 'list' | 'dictionary' | 'set' | 'enum';
    export type CompareResult = -1 | 0 | 1;
    export type EnumMap<TKey extends string = string> = Record<TKey, string>;
    export type MonoidFunction = <T, TResult>(left: T) => (right: T) => TResult;
    export type CompareFunction<T> = MonoidFunction<T, CompareResult>;
    export type EqualityFunction<T> = MonoidFunction<T, boolean>;
    export type DropDownOptionInfo<T> = {
        key: number;
        value: string;
        label: string;
        obj: RealmObj<T>;
    };
    export type RealmFilter = [string, any[]];
    export type EntityConstructor<T extends EntityBase> = {
        schema: ObjectSchema;
        columns?: ColumnDef<T, any>[];
        defaultSort?: SortDescriptor[];
        defaultFilters?: RealmFilter[];
        labelProperty?: keyof T;
    };
    export interface IEquatable<T> {
        (left: T): (right: T) => boolean;
    }
    export interface IComparable<T> {
        (left: T): (right: T) => CompareResult;
    }
    export type RealmObjects =
        | 'mercariBrand'
        | 'mercariCategory'
        | 'mercariSubCategory'
        | 'mercariSubSubCategory'
        | 'brand'
        | 'classifier'
        | 'product'
        | 'sku'
        | 'listing'
        | 'draft'
        | 'productImage'
        | 'scan'
        | 'locationSegment'
        | 'hashTag'
        | 'hashTagUsage'
        | 'rn'
        | 'customItemField';
    export type ContentsTypes = 'icon' | 'label';
    export type ProductAttribute<T = string> = [isSkipped: boolean, text: string | undefined, kvp: string | undefined, selector: string | undefined, value?: T];
    export type TableInfo = { defaultSort?: SortDescriptor[]; defaultFilter?: [string, any[]]; columns?: ColumnDef<any, any>[] };
    export type AnyFunction = <T extends any[]>(...args: T) => any;
    export type AnyArray = any[];
    export type AnyObject = Record<string, any>;
    export type Children = React.Node | React.Node[] | undefined;
    export type Props = { className?: string; children?: Children };
    export type MadeOf = Partial<Record<MaterialKeys, number>>;
    export type Optional<T> = T | undefined;
    export type RealmObj<T> = Realm.Object<T> & T;
    export type OptObj<T> = RealmObj<T> | undefined;
    export type DBList<T> = Realm.Types.List<T>;
    export type DBDictionary<T> = Realm.Types.Dictionary<T>;
    export type DBSet<T> = Realm.Types.Set<T>;
    export type DBBacklink<T> = Realm.Types.LinkingObjects<T, any>;
    export type MercariColor = 'black' | 'grey' | 'white' | 'beige' | 'red' | 'gold' | 'silver' | 'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'brown';
    export interface IRealmType {
        (): string;
        req: string;
        opt: string;
        list: string;
        dictionary: string;
        set: string;
    }
    interface BoolType {
        (): string;
        true: { type: PropertyTypeName; default: boolean };
        false: { type: PropertyTypeName; default: boolean };
    }
    interface StringType extends IRealmType {
        empty: { type: PropertyTypeName; default: string };
    }
    interface NumberType extends IRealmType {
        zero: { type: PropertyTypeName; default: number };
        two: { type: PropertyTypeName; default: number };
    }
    type RealmObjects =
        | 'mercariBrand'
        | 'mercariCategory'
        | 'mercariSubCategory'
        | 'mercariSubSubCategory'
        | 'brand'
        | 'classifier'
        | 'product'
        | 'sku'
        | 'listing'
        | 'draft'
        | 'productImage'
        | 'scan'
        | 'locationSegment';
    type DB = { [P in RealmObjects]: IRealmType } & {
        objectId: string;
        bool: BoolType;
        string: StringType;
        int: NumberType;
        float: NumberType;
        decimal128: NumberType;
        double: NumberType;
        uuid: string;
        date: IRealmType;
        data: IRealmType;
        backlink(name: string, property: string): PropertySchema;
    };

    export type ConditionKeys = 1 | 2 | 3 | 4 | 5;
    export type EnglishWeight = {
        lb?: number;
        oz?: number;
    };
    export type LWH = {
        length?: number;
        width?: number;
        height?: number;
    };
    export type ShippingServiceKeys = 'standard' | 'media-mail';
    // export type LocationTypeKeys = 'fixture' | 'shelf' | 'bin';
    // export type LocationKind = 'half-square' | 'square' | 'metro-rack' | 'metro-shelf' | 'area' | 'storage-tote' | 'under-table' | 'closet' | 'over-table' | 'stack' | 'dvd-bag' | 'vhs-bag' | 'box';
    // export type LocationLabelColor = 'pink' | 'orange' | 'purple' | 'yellow' | 'green' | 'blue' | 'white';

    export type Predicate<T> = (x: T) => boolean;

    export interface Window {
        $$store: Realm | undefined;
    }

    export type ShippingServiceInfo = {
        carrier: string;
        price: number;
        id: number;
    };

    export type ShippingDetails = {
        min: number;
        max: number;
        standard: ShippingServiceInfo;
        'media-mail'?: ShippingServiceInfo;
    };

    export type ContentsType = 'label' | 'icon';
    export type FieldInfo = [propertyName: string, type: RealmTypes, objectType?: string];
    export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
    export type ConditionOrBoolean = boolean | Predicate<void>;
    export type Initializer<T> = () => T;
    export type RealmInitializer = Initializer<BSON.ObjectId | string | number | boolean | ArrayBuffer | Date | BSON.UUID>;
    export type JITTColumnDef<T, TValue> = IdentifiedColumnDef<T, TValue> & { meta: ColumnMeta<T, TValue> };
    export interface Valid<T> {
        type: 'valid';
        value: T;
    }
    export interface Invalid {
        type: 'invalid';
        message?: string;
    }
    export type Validation<T> = Valid<T> | Invalid;
    export type Validator<T> = (x?: T) => Validation<T>;
    export type DataElementType =
        | 'select'
        | 'text'
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week'
        | undefined;
    export type ResultantOrVoid<T> = T | void;
    export type DataSubmitterFunction<T, TResultant> = (data: T) => ResultantOrVoid<TResultant> | Promise<ResultantOrVoid<TResultant>>;
    export type DataWithDirtySubmitterFunction<T, TResultant> = (data: T, dirtyColumns: string[]) => ResultantOrVoid<TResultant> | Promise<ResultantOrVoid<TResultant>>;
    export type FormSubmitterFunctions<T, TResultant> = DataSubmitterFunction<T, TResultant> | DataWithDirtySubmitterFunction<T, TResultant>;
    export type UpdateRecordMutation<T> = UseMutateFunction<
        void,
        Error,
        {
            payload: Partial<T> & AnyObject;
            id: OID;
            dirtyProperties: string[];
        },
        unknown
    >;
    export type InsertRecordMutation<T> = UseMutateFunction<RealmObj<T>, Error, { payload: T }, unknown>;
    export type TableScope = 'top-level' | 'links' | 'list' | 'selection';
    export type SubComponentFunction<T> = React.FunctionComponent<{ row: Row<T>; collectionName: string; table: Table<T> }>;
    export type DefinedColumn = ColumnDef<any, any>;
    export type DefinedColumns = DefinedColumn[];   
}

declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        datatype: RealmTypes;
        objectType?: RealmObjects | RealmTypes;
        labelProperty?: string;
        defaultValue?: ReturnType<RealmInitializer> | RealmInitializer;
        enumMap?: EnumMap;
        readonly?: boolean;
        required?: boolean;
        validators?: Validator<TValue | undefined>[];
        inputType?: React.HTMLInputTypeAttribute;
        max?: number;
        min?: number;
        maxLength?: number;
        minLength?: number;
        pattern?: RegExp;
        step?: number;
        multiple?: boolean;
        multiplier?: number;
        precision?: number;
        formatString?: (x: TValue) => string;
    }
    interface TableMeta<TData extends RowData> {
        collectionName: string;
        schema: Realm.ObjectSchema;
        scope: TableScope;
        objectType?: ['list' | 'dictionary' | 'set', string];
        propertyName?: string;
    }
}

export const i = 1;
