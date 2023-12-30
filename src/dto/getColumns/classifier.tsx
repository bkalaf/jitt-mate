import { IClassifier, IHashTag, IMercariSubSubCategory } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const classifierColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IClassifier> =>
        (
            [
                $metas.oid,
                $metas.string<IClassifier>('name', { required: true, maxLength: 50 }, false),
                $metas.textBlock<IClassifier>('notes', { rows: 5, maxLength: 1000 }, false),
                $metas.lookup<IClassifier, IMercariSubSubCategory>('mercariSubSubCategory', { objectType: 'mercariSubSubCategory', labelPropertyName: 'fullname' }, false),
                $metas.string<IClassifier>('shortname', { maxLength: 30 }, false),
                $metas.percent<IClassifier>('shipWeightPercent', { min: 1, max: 2 }, false),
                $metas.percent('effectiveShipWeightPercent', { readOnly: true, min: 1, max: 2 }, false),
                $metas.embed<IClassifier>('taxon', { getColumnsKey: 'productTaxonomy' }, false),
                $metas.set<IClassifier, IHashTag, 'hashTags'>('hashTags', 'classifier', 'hashTag', 'name', {}, false),
                $metas.list('effectiveHashTags', { readOnly: true, header: 'All Tags', labelProperty: 'name', objectType: 'mercariCategory', ofObjectType: 'hashTag' }, false)
            ] as DefinedMRTColumns<IClassifier>
        ).map((x) =>
            x?.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IClassifier>
} as StaticTableDefinitions<IClassifier>;
