import { MRT_ColumnDef } from 'material-react-table';
import { IHashTag, IMercariSubCategory, IMercariSubSubCategory } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const mercariSubSubCategoryColumns = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getColumns: (...pre: string[]): MRT_ColumnDef<IMercariSubSubCategory, any>[] =>
        (
            [
                $metas.oid,
                $metas.string('name', { maxLength: 50, required: true }, false),
                $metas.string('fullname', { readOnly: true }, false),
                $metas.string('id', { maxLength: 50, required: true }, false),
                $metas.lookup<IMercariSubSubCategory, IMercariSubCategory>('parent', { objectType: 'mercariSubCategory', labelPropertyName: (x: IMercariSubCategory) => x.fullname }),
                $metas.embed<IMercariSubSubCategory>('taxon', { getColumnsKey: 'productTaxonomy' }, false),
                $metas.set<IMercariSubSubCategory, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false),
                $metas.list('effectiveHashTags', { readOnly: true, header: 'All Tags', labelProperty: 'name', objectType: 'mercariSubSubCategory', ofObjectType: 'hashTag' }, false)
            ] as DefinedMRTColumns<IMercariSubSubCategory>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IMercariSubSubCategory>
} as StaticTableDefinitions<IMercariSubSubCategory>;