/* eslint-disable @typescript-eslint/no-explicit-any */
import Realm, { BSON, SortDescriptor, ObjectSchema, PropertyTypeName, PropertySchema } from 'realm';
import { ColumnDef, ColumnMeta, FilterFn, IdentifiedColumnDef, Row, RowData, SortingFn, Table } from '@tanstack/react-table';
import { UseMutateFunction } from '@tanstack/react-query';
import { RankingInfo } from '@tanstack/match-sorter-utils';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';

declare global {
    export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
    export type Not<A extends boolean> = A extends true ? false : true;
    // export type Or<A extends boolean, B extends boolean> = A extends true ? true : B extends true ? true : false;
    export type IsReadonly<O extends Record<any, any>, P extends keyof O> = Not<Equals<{ [_ in P]: O[P] }, { -readonly [_ in P]: O[P] }>>;

    export type GetReadOnlyProperties<A extends Record<string, any>> = Exclude<{ [P in keyof A]: IsReadonly<A, P> extends true ? P : never }[keyof A], undefined>;
    export type GetNonReadOnlyProperties<A extends Record<string, any>> = Exclude<{ [P in keyof A]: IsReadonly<A, P> extends true ? never : P }[keyof A], undefined>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    export type FunctionProperties<T> = { [P in keyof T]: T[P] extends Function ? P : never }[keyof T];
    export type WithoutAccessors<T extends AnyObject> = Pick<T, Exclude<Exclude<keyof T, FunctionProperties<T>>, GetReadOnlyProperties<T>>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type OID = BSON.ObjectId | string;
    export type Updater<T> = (x: T) => T;
    export type Len1<TArr extends any[]> = ((...args: TArr) => any) extends (...[x, ...args]: [any, ...infer R]) => any ? R['length'] : never;
    export type Last<TArr extends any[]> = TArr[Len1<TArr>];
    export type EntityBase = { _id: OID };
    export type RealmTypes = 'objectId' | 'uuid' | 'string' | 'int' | 'double' | 'float' | 'decimal128' | 'bool' | 'object' | 'date' | 'data' | 'list' | 'dictionary' | 'set' | 'enum';
    export type CompareResult = -1 | 0 | 1;
    export type EnumMap<TKey extends string = string, TValue = string> = Record<TKey, TValue>;
    export type MonoidFunction<T, TResult> = (left: T) => (right: T) => TResult;
    export type CompareFunction<T> = MonoidFunction<T, CompareResult>;
    export type EqualityFunction<T> = MonoidFunction<T, boolean>;
    export type DropDownOptionInfo<T> = {
        key: number;
        value: string;
        label: string;
        obj: Entity<T>;
    };
    export type RealmFilter = [string, any[]];
    export type EntityConstructor<T extends EntityBase> = {
        schema: ObjectSchema;
        columns?: (...prefixes: string[]) => DefinedColumns;
        // embeddedColumns?: (x?: string) => DefinedColumns[];
        defaultSort?: SortDescriptor[];
        defaultFilters?: RealmFilter[];
        labelProperty?: keyof T;
    };
    export type StaticTableDefinitions<T extends MRT_RowData> = {
        getColumns: (...p: string[]) => DefinedMRTColumns<T>;
        createRenderDetailPanel: (fields: FieldInfo[]) => MRT_TableOptions<T>['renderDetailPanel'];
    };
    export type ComboBoxOption = { label: string; value: string; node: number; parent?: string } | string;
    export type MRT_TableOptionFunctionParams<T extends AnyObject, K extends keyof MRT_TableOptions<T>> = Parameters<Exclude<MRT_TableOptions<T>[K], undefined>>[0];
    export type MRT_TableOptionFunctionReturn<T extends AnyObject, K extends keyof MRT_TableOptions<T>> = ReturnType<Exclude<MRT_TableOptions<T>[K], undefined>>;
    export type MRT_ColumnDefFunctionParams<K extends FunctionProperties<MRT_ColumnDef<T, V>>, V = unknown, T extends MRT_RowData = AnyObject> = Parameters<Exclude<MRT_ColumnDef<T, V>[K] & AnyFunction, undefined>>[0];
    export type FieldDecoratorFunc = (_target: any, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext) => void;
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
        | 'customItemField'
        | 'barcode'
        | 'address'
        | 'productTaxonomy'
        | 'measurements'
        | 'flags'
        | 'madeOf'
        | 'dimensions';
    export type ContentsTypes = 'icon' | 'label';
    export type ProductAttribute<T = string> = [isSkipped: boolean, text: string | undefined, kvp: string | undefined, selector: string | undefined, value?: T];
    export type TableInfo = { defaultSort?: SortDescriptor[]; defaultFilter?: [string, any[]]; columns?: ColumnDef<any, any>[] };
    export type AnyFunction = <T extends any[]>(...args: T) => any;
    export type AnyArray = any[];
    export type AnyObject = Record<string, any>;
    export type Children = React.ReactNode | React.ReactNode[] | undefined;
    export type Props = { className?: string; children?: Children };
    export type MadeOf = Partial<Record<string, number>>;
    export type Optional<T> = T | undefined;
    export type Entity<T> = Realm.Object<T> & T;
    export type OptionalEntity<T> = Entity<T> | undefined;
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

    export interface IParseSuccess<T> {
        kind: 'success';
        value: T;
    }
    export interface IParseFailure {
        kind: 'failure';
        value: string;
        message: string;
    }
    export type ParseResult<T> = IParseSuccess<T> | IParseFailure;
    export type InsertRecordMutation<T> = UseMutateFunction<Entity<T>, Error, { payload: T }, unknown>;
    export type TableScope = 'top-level' | 'links' | 'list' | 'selection';
    export type SubComponentFunction<T> = React.FunctionComponent<{ row: Row<T>; collectionName: string; table: Table<T> }>;
    export type DefinedColumn = ColumnDef<any, any>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    export type FunctionProperties<T extends AnyObject> = keyof{ [P in keyof T]: T[P] extends AnyFunction ? keyof T : T[P] extends (AnyFunction | undefined) ? keyof T : never }
    export type DefinedMRTColumn<T extends MRT_RowData> = MRT_ColumnDef<T, any>;
    export type DefinedColumns = DefinedColumn[];
    export type DefinedMRTColumns<T  extends MRT_RowData = any> = DefinedMRTColumn<T>[];
    export type StringOr<T = string> = string | T | undefined;
    export type PreProcessFunction<TInput, TOutput> = (x?: TInput) => TOutput;
    export type RealmCollectionTypes = 'list' | 'dictionary' | 'set' | 'linkingObjects';
    export type RealmCollections<T> = DBSet<T> | DBDictionary<T> | DBList<T>;
    export type HTMLRadioInputElements = HTMLInputElement[];
    export type DataControlElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLRadioInputElements;
    export type LaundryCareItemInfo = {
        SvgElement: React.FunctionComponent<{ className?: string }>;
        name: string;
    };
    export type IClothingCareClusterProps = {
        elements: LaundryCareItemInfo[];
        isSelected: (n: string) => boolean;
        getToggler: (n: string) => () => void;
        title: string;
        register: (n: string) => void;
    };
    export interface SymbolConstructor {
        readonly convertToRealm: unique symbol;
        readonly convertFromRealm: unique symbol;
        readonly calculatedFields: unique symbol;
        readonly init: unique symbol;
        readonly getValues: unique symbol;
        readonly setValues: unique symbol;
        readonly setDefaultValues: unique symbol;
    }
    export type ListOf<T> = T extends DBList<infer R> ? R : T extends DBDictionary<infer R> ? R : T extends DBSet<infer R> ? R : T extends Array<infer R> ? R : never;
    export type ValueOutFunc<T> = (x?: string | string[]) => (T | null | ListOf<T>[])
}

declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        datatype?: RealmTypes;
        required?: boolean;
        justify?: 'justify-center' | 'justify-start' | 'justify-end' | 'justify-between' | 'justify-evenly' | 'justify-around';
        valueIn?: ((x?: TValue | null) => string) | ((x?: DBSet<ListOf<TValue>> | null) => string[]);
        valueOut?: ((x?: string) => (TValue | null)) | ((x?: string[]) => ListOf<TValue>[]);
        defaultValue?: TValue | (() => Promise<TValue>)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        collectionName: string;
        schema: Realm.ObjectSchema;
        scope: TableScope;
        objectType?: ['list' | 'dictionary' | 'set', string];
        propertyName?: string;
    }
}

declare module '@tanstack/table-core' {
    interface SortingFns {
        sortBarcode: SortingFn<any>;
    }
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}
export const i = 1;
