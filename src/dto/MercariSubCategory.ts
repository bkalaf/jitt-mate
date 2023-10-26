import Realm, { BSON, SortDescriptor } from 'realm';
import { $db } from './db';
import { IHashTag, IMercariCategory, IMercariSubCategory } from './types';
import { ApparelGroups, ApparelGroupsKey } from './enums/apparelGroups';
import { ApparelTypes, ApparelTypesKey } from './enums/apparelType';
import { ItemGroups, ItemGroupsKey } from './enums/itemGroups';
import { $css } from './$css';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { OIDTableCell } from '../components/Table/Cells/OIDTableCell';
import { StringTableCell } from '../components/Table/Cells/StringTableCell';
import { fromOID } from './fromOID';
import { EnumTableCell } from '../components/Table/Cells/EnumTableCell';
import { LookupTableCell } from '../components/Table/Cells/LookupTableCell';

export const helper = createColumnHelper<IMercariSubCategory>();
export class MercariSubCategory extends Realm.Object<IMercariSubCategory> implements IMercariSubCategory {
    gather(this: IMercariSubCategory): {
        itemGroup?: Optional<keyof ItemGroups>;
        hashTags?: IHashTag[] | undefined;
        subCategoryId?: any;
        apparelType?: Optional<keyof ApparelTypes>;
        apparelGroup?: Optional<keyof ApparelGroups>;
    } {
        const gathered = {
            itemGroup: this.itemGroup,
            hashTags: Array.from(this.hashTags.values()),
            subCategoryId: this.$selector,
            apparelType: this.apparelType,
            apparelGroup: this.apparelGroup
        };
        return gathered;
    }
    get $selector(): string {
        return $css.id(this.id);
    }
    name = '';
    id = '';
    parent: OptObj<IMercariCategory>;
    apparelType: Optional<keyof ApparelTypes>;
    apparelGroup: Optional<keyof ApparelGroups>;
    itemGroup: Optional<keyof ItemGroups>;
    hashTags: DBSet<IHashTag> = [] as any;
    _id: BSON.ObjectId = new BSON.ObjectId();
    update(this: IMercariSubCategory, realm: Realm): IMercariSubCategory {
        return this;
    }
    // _id: BSON.ObjectId = new BSON.ObjectId();
    // name = '';
    // id = '';
    // parent: OptObj<IMercariCategory>;
    // apparelType: Optional<ApparelTypeKeys>;
    // apparelGroup: Optional<ApparelGroupKeys>;
    // itemGroup: Optional<ItemGroupKeys>;
    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariCategory.opt,
            apparelType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set
        }
    };
    static labelProperty: keyof IMercariSubCategory = 'name';
    static defaultSort: SortDescriptor[] = ['parent.name', 'name'];
    static columns: ColumnDef<IMercariSubCategory, any>[] = [
        helper.accessor((x) => fromOID(x._id), { cell: OIDTableCell<IMercariSubCategory>, id: '_id', header: 'OID', meta: { datatype: 'objectId' } }),
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
                objectType: 'mercariCategory'
            }
        })
        // helper.accessor('hashTags', {
        //     cell: EnumTableCell,
        //     header: 'Hash Tags',
        //     id: 'hashTags',
        //     meta: {
        //         datatype: 'enum',
        //         enumMap: ApparelTypes as EnumMap<ApparelTypesKey>
        //     }
        // })
        // helper.accessor('gender', { header: 'Gender', meta: { datatype: 'enum', enumMap: Genders as EnumMap<GendersKey> } }),
        // helper.accessor('itemGroup', { header: 'Item Group', meta: { datatype: 'enum', enumMap: ItemGroups as EnumMap<ItemGroupsKey> } })
    ];
}
