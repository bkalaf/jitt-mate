import { IHashTag, IMercariCategory } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const mercariCategoryColumns = {
    getColumns: (...pre: string[]) =>
        (
            [
                $metas.oid,
                $metas.string('name', { maxLength: 50, required: true }, false),
                $metas.string('id', { maxLength: 50, required: true }, false),

                $metas.percent<IMercariCategory>('shipWeightPercent', { min: 1, max: 2 }, false),
                $metas.embed<IMercariCategory>('taxon', { getColumnsKey: 'productTaxonomy' }, false),
                $metas.set<IMercariCategory, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false),
                $metas.list('effectiveHashTags', { readOnly: true, header: 'All Tags', labelProperty: 'name', objectType: 'mercariCategory', ofObjectType: 'hashTag' }, false)
            ] as DefinedMRTColumns<IMercariCategory>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IMercariCategory>
} as StaticTableDefinitions<IMercariCategory>;