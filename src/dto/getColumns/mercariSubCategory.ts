import { createMRTColumnHelper } from 'material-react-table';
import { IHashTag, IMercariCategory, IMercariSubCategory } from '../../dal/types';
import { productTaxonomyColumns } from './productTaxonomy';
import { dataStructureMeta } from '../../components/Table/dataStructureMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { percentageMeta } from '../../components/Table/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';

export const mercariSubCategoryHelper = createMRTColumnHelper<IMercariSubCategory>();

export const mercariSubCategoryColumns = {
    getColumns: (...pre: string[]) =>
        [
            mercariSubCategoryHelper.accessor('_id', objectIdMeta),
            // subCategory.accessor('taxon.name', {
            //     enableEditing: false,
            //     id: 'taxon.name',
            //     header: 'Taxonomy'
            // }),
            mercariSubCategoryHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name', maxLength: 50, required: true })
            }),
            mercariSubCategoryHelper.accessor('id', {
                ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
            }),
            mercariSubCategoryHelper.accessor('parent', {
                ...lookupMeta<IMercariCategory, IMercariSubCategory>('parent', 'mercariCategory', 'name', { header: 'Parent' })
            }),
            mercariSubCategoryHelper.accessor('hashTags', {
                ...dataStructureMeta<IMercariSubCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariSubCategory', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
            }),
            mercariSubCategoryHelper.accessor('shipWeightPercent', {
                ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            ...(productTaxonomyColumns.getColumns('taxon') as DefinedMRTColumns<IMercariSubCategory>)
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined }))
} as StaticTableDefinitions<IMercariSubCategory>;