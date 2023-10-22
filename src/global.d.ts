declare global {
    export type Children = React.Node | React.Node[] | undefined;
    export type MadeOf = Partial<Record<MaterialKeys, number>>;
    export type Opt<T> = T | undefined;
    export type RealmObj<T> = (Realm.Object<T> & T);
    export type OptObj<T> = RealmObj<T> | undefined;

    export type MercariColor =
        'black' | 'grey' | 'white' | 'beige' | 'red' | 'gold' | 'silver' |
        'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'brown';
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
        true: { type: PropertyTypeName; default: boolean; };
        false: { type: PropertyTypeName; default: boolean; };
    }
    interface StringType extends IRealmType {
        empty: { type: PropertyTypeName; default: string; };
    }
    interface NumberType extends IRealmType {
        zero: { type: PropertyTypeName; default: number; };
        two: { type: PropertyTypeName; default: number; };
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
    export type ShippingService = 'standard' | 'media-mail';
    export type LocationTypeKeys = 'fixture' | 'shelf' | 'bin';
    export type LocationKind = 'half-square' | 'square' | 'metro-rack' | 'metro-shelf' | 'area' | 'storage-tote' | 'under-table' | 'closet' | 'over-table' | 'stack' | 'dvd-bag' | 'vhs-bag' | 'box';
    export type LocationLabelColor = 'pink' | 'orange' | 'purple' | 'yellow' | 'green' | 'blue' | 'white';
    export type Predicate<T> = (x: T) => boolean;
}

export const i = 1;