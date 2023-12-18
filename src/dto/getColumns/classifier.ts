import { IClassifier, IHashTag, IMercariSubSubCategory } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const classifierColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IClassifier> =>
        (
            [
                $metas.oid,
                $metas.string<IClassifier>('name', { required: true, maxLength: 50 }, false),
                $metas.bool<IClassifier>('isAthletic', { defaultValue: false }, false),
                $metas.lookup<IClassifier, IMercariSubSubCategory>('mercariSubSubCategory', { objectType: 'mercariSubSubCategory', labelPropertyName: 'fullname' }, false),
                $metas.string<IClassifier>('shortname', { maxLength: 30 }, false),

                $metas.percent<IClassifier>('shipWeightPercent', { min: 1, max: 2 }, false),
                $metas.embed<IClassifier>('taxon', { getColumnsKey: 'productTaxonomy' }, false),
                $metas.set<IClassifier, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false)
            ] as DefinedMRTColumns<IClassifier>
        ).map((x) =>
            x?.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IClassifier>
} as StaticTableDefinitions<IClassifier>;
