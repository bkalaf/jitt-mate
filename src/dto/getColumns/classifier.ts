import { createMRTColumnHelper } from 'material-react-table';
import { IClassifier, IHashTag, IMercariSubSubCategory } from '../../dal/types';
import { boolMeta } from '../../components/Table/metas/boolMeta';
import { dataStructureMeta } from '../../components/Table/dataStructureMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { percentageMeta } from '../../components/Table/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { productTaxonomyColumns } from './productTaxonomy';

export const classifierHelper = createMRTColumnHelper<IClassifier>();

export const classifierColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            classifierHelper.accessor('_id', objectIdMeta),
            classifierHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 50 })
            }),
            classifierHelper.accessor('isAthletic', {
                ...boolMeta({ propertyName: 'isAthletic', header: 'Is Athletic', defaultValue: false })
            }),
            classifierHelper.accessor('mercariSubSubCategory', {
                ...lookupMeta<IMercariSubSubCategory, IClassifier>('mercariSubSubCategory', 'mercariSubSubCategory', 'fullname', { header: 'Full Name' })
            }),
            classifierHelper.accessor('shortname', {
                ...stringMeta({ propertyName: 'shortname', header: 'Short Name', maxLength: 30 })
            }),
            classifierHelper.accessor('hashTags', {
                ...dataStructureMeta<IClassifier, IHashTag, 'hashTags'>('hashTags', 'name', 'classifier', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
            }),
            classifierHelper.accessor('shipWeightPercent', {
                ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            ...(productTaxonomyColumns.getColumns('taxon') as DefinedMRTColumns<IClassifier>)
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IClassifier>;