import Realm, { BSON, PropertySchema, PropertyTypeName } from 'realm';
import { $db } from './db';
import { ICustomItemField, IHashTag, IMercariSubCategory, IMercariSubSubCategory } from './types';
import { ObjectId } from 'mongodb';
import { ApparelGroups, ApparelGroupsKey } from './enums/apparelGroups';
import { ApparelTypes, ApparelTypesKey } from './enums/apparelType';
import { ItemGroups, ItemGroupsKey } from './enums/itemGroups';
import { LegTypes } from './enums/legTypes';
import { SizingTypes } from './enums/sizingTypes';
import { SleeveTypes } from './enums/sleeveTypes';
import { TopAdornments } from './enums/topAdornments';
import { $css } from './$css';
import { checkTransaction } from '../util/checkTransaction';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { EnumTableCell } from '../components/Table/Cells/EnumTableCell';
import { LookupTableCell } from '../components/Table/Cells/LookupTableCell';
import { OIDTableCell } from '../components/Table/Cells/OIDTableCell';
import { StringTableCell } from '../components/Table/Cells/StringTableCell';
import { fromOID } from './fromOID';
import { is } from './is';
import { endsWith } from './endsWith';

const isOptional = endsWith('?');
const isList = endsWith('[]');
const isDictionary = endsWith('{}');
const isSet = endsWith('<>');
const cleanup = (input: string) => ['?', '[', ']', '{', '}', '<', '>'].map((toReplace) => (s: string) => s.replaceAll(toReplace, '')).reduce((pv, cv) => cv(pv), input);

const isPrimitive = (str: string) => ['int', 'double', 'decimal128', 'float', 'bool', 'string', 'date', 'data', 'objectId', 'uuid', 'enum', 'linkingObjects'].includes(cleanup(str));

const ifList = (s: string): string | PropertySchema => (isList(s) ? { type: 'list', objectType: cleanup(s) } : s);
const ifOpt = (s: string): string | PropertySchema => (isOptional(s) ? { type: cleanup(s) as Realm.PropertyTypeName, optional: true } : s);
const ifDictionary = (s: string): string | PropertySchema => (isDictionary(s) ? { type: 'dictionary', objectType: cleanup(s) } : s);
const ifSet = (s: string): string | PropertySchema => (isSet(s) ? { type: 'set', objectType: cleanup(s) } : s);
const ifPrimitive = (s: string): PropertySchema | string => isPrimitive(s) ? { type: s as PropertyTypeName, optional: false } : s;

const handleIf = (func: (s: string) => string | PropertySchema) => (item: string | PropertySchema) => is.string(item) ? func(item) : item;

export function normalizeSchemaProperty(sp: string | PropertySchema): PropertySchema {
    const result = [ifOpt, ifList, ifDictionary, ifSet, ifPrimitive].map(handleIf).reduce((pv, cv) => cv(pv), sp);
    if (is.string(result)) throw new Error(`could not normalize: ${sp}`);
    return result as PropertySchema;
}
const helper = createColumnHelper<IMercariSubSubCategory>();
export class MercariSubSubCategory extends Realm.Object<IMercariSubSubCategory> implements IMercariSubSubCategory {
    name = '';
    id = '';
    parent: OptObj<IMercariSubCategory>;
    fullname = '';
    hashTags: DBSet<IHashTag> = [] as any;
    apparelType: Optional<keyof ApparelTypes>;
    apparelGroup: Optional<keyof ApparelGroups>;
    itemGroup: Optional<keyof ItemGroups>;
    legType: Optional<keyof LegTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    sleeveType: Optional<keyof SleeveTypes>;
    sizingType: Optional<keyof SizingTypes>;
    customItemFields: DBList<ICustomItemField> = [] as any;
    get $selector(): string {
        return $css.id(this.id);
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    update(this: IMercariSubSubCategory, realm: Realm): IMercariSubSubCategory {
        const fullname = [this.parent?.parent?.name, this.parent?.name, this.name].join('::');
        const func = () => {
            this.fullname = fullname;
        };
        checkTransaction(realm)(func);
        return this;
    }
    gather(this: IMercariSubSubCategory): {
        subSubCategoryId?: any;
        apparelType?: Optional<keyof ApparelTypes>;
        apparelGroup?: Optional<keyof ApparelGroups>;
        itemGroup?: Optional<keyof ItemGroups>;
        legType?: Optional<keyof LegTypes>;
        topAdornment?: Optional<keyof TopAdornments>;
        sleeveType?: Optional<keyof SleeveTypes>;
        sizingType?: Optional<keyof SizingTypes>;
        customItemFields?: ICustomItemField[] | undefined;
        hashTags?: IHashTag[] | undefined;
    } {
        return {
            subSubCategoryId: this.$selector,
            apparelGroup: this.apparelGroup,
            apparelType: this.apparelType,
            itemGroup: this.itemGroup,
            legType: this.legType,
            sizingType: this.sizingType,
            sleeveType: this.sleeveType,
            topAdornment: this.topAdornment,
            customItemFields: Array.from(this.customItemFields),
            hashTags: Array.from(this.hashTags)
        };
    }
    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            apparelType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            parent: $db.mercariSubCategory.opt,

            fullname: $db.string.opt,
            hashTags: $db.hashTag.set,
            legType: $db.string.opt,
            topAdornment: $db.string.opt,
            sleeveType: $db.string.opt,
            sizingType: $db.string.opt,
            customItemFields: $db.customItemField.list
        }
    };
    static labelProperty: keyof IMercariSubSubCategory = 'fullname';
    static defaultSort: Realm.SortDescriptor[] = ['fullname'];
    static columns: ColumnDef<IMercariSubSubCategory, any>[] = [
        helper.accessor((x) => fromOID(x._id), { cell: OIDTableCell<IMercariSubSubCategory>, id: '_id', header: 'OID', meta: { datatype: 'objectId' } }),
        helper.accessor('name', { cell: StringTableCell, header: 'Name', meta: { datatype: 'string' } }),
        helper.accessor('id', { cell: StringTableCell, header: 'ID', meta: { datatype: 'string' } }),
        helper.accessor('apparelType', {
            cell: EnumTableCell,
            header: 'Apparel Type',
            meta: {
                datatype: 'enum',
                enumMap: ApparelTypes as EnumMap<ApparelTypesKey>
            }
        }),
        helper.accessor('apparelGroup', {
            cell: EnumTableCell,
            header: 'Apparel Group',
            meta: {
                datatype: 'enum',
                enumMap: ApparelGroups as EnumMap<ApparelGroupsKey>
            }
        }),
        helper.accessor('itemGroup', {
            cell: EnumTableCell,
            header: 'Item Group',
            meta: {
                datatype: 'enum',
                enumMap: ItemGroups as EnumMap<ItemGroupsKey>
            }
        }),
        helper.accessor('parent', {
            cell: LookupTableCell,
            header: 'Parent',
            meta: {
                datatype: 'object',
                labelProperty: 'name',
                objectType: 'mercariSubCategory'
            }
        })
    ];
}
