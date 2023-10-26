import Realm, { BSON, SortDescriptor } from 'realm';
import { $db } from './db';
import { IHashTag, IMercariCategory } from './types';
import { CellContext, ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { OIDTableCell } from '../components/Table/Cells/OIDTableCell';
import { $css } from './$css';
import { StringTableCell } from '../components/Table/Cells/StringTableCell';
import { fromOID } from './fromOID';
import { ItemGroups, ItemGroupsKey } from './enums/itemGroups';
import { Genders, GendersKey } from './enums/genders';

const helper = createColumnHelper<IMercariCategory>();

export class MercariCategory extends Realm.Object<IMercariCategory> implements IMercariCategory {
    gender: Optional<keyof Genders>;
    itemGroup: Optional<keyof ItemGroups>;
    gather(this: IMercariCategory): { categoryId?: any; gender?: Optional<GendersKey>; itemGroup?: Optional<ItemGroupsKey>; hashTags?: IHashTag[] | undefined } {
        return {
            hashTags: Array.from(this.hashTags.values()),
            itemGroup: this.itemGroup,
            gender: this.gender,
            categoryId: this.$selector
        };
    }
    get $selector(): string {
        return $css.id(this.id);
    }
    update(this: IMercariCategory, realm: Realm): IMercariCategory {
        return this;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    id = '';
    hashTags: DBSet<IHashTag> = [] as any;

    static labelProperty: keyof IMercariCategory = 'name';
    static defaultSort: SortDescriptor[] = ['name'];
    static schema: Realm.ObjectSchema = {
        name: $db.mercariCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            gender: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set
        }
    };
    static columns: ColumnDef<IMercariCategory, any>[] =[
        helper.accessor((x) => fromOID(x._id), { cell: OIDTableCell<IMercariCategory>, id: '_id', header: 'OID', meta: { datatype: 'objectId' } }),
        helper.accessor('name', { cell: StringTableCell, header: 'Name', meta: { datatype: 'string' } }),
        helper.accessor('id', { cell: StringTableCell, header: 'ID', meta: { datatype: 'string' } }),
        helper.accessor('gender', { header: 'Gender', meta: { datatype: 'enum', enumMap: Genders as EnumMap<GendersKey> } }),
        helper.accessor('itemGroup', { header: 'Item Group', meta: { datatype: 'enum', enumMap: ItemGroups as EnumMap<ItemGroupsKey> } })
    ];
}
