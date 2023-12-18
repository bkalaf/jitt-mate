import { createMRTColumnHelper } from 'material-react-table';
import { IHashTag, IMercariCategory, IMercariSubCategory } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const mercariSubCategoryHelper = createMRTColumnHelper<IMercariSubCategory>();

export const mercariSubCategoryColumns = {
    getColumns: (...pre: string[]) =>
        (
            [
                $metas.oid,
                $metas.string('name', { maxLength: 50, required: true }, false),
                $metas.string('fullname', { readOnly: true }, false),
                $metas.string('id', { maxLength: 50, required: true }, false),
                $metas.lookup<IMercariSubCategory, IMercariCategory>('parent', { objectType: 'mercariCategory', labelPropertyName: 'name' }),
                $metas.percent<IMercariSubCategory>('shipWeightPercent', { min: 1, max: 2 }, false),
                $metas.embed<IMercariSubCategory>('taxon', { getColumnsKey: 'productTaxonomy' }, false),
                $metas.set<IMercariSubCategory, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false)
            ] as DefinedMRTColumns<IMercariSubCategory>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IMercariSubCategory>
} as StaticTableDefinitions<IMercariSubCategory>;