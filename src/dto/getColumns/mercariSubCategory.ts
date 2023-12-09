import { createMRTColumnHelper } from 'material-react-table';
import { IHashTag, IMercariCategory, IMercariSubCategory } from '../../dal/types';
import { productTaxonomyColumns } from './productTaxonomy';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';
import { percentageMeta } from '../../components/Table/metas/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { $metas } from '../../components/Table/metas';

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
                ...$metas.set<IMercariSubCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariSubCategory', 'hashTag',{ header: 'Hash Tags' })
            }),
            mercariSubCategoryHelper.accessor('shipWeightPercent', {
                ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            ...(productTaxonomyColumns.getColumns('taxon') as DefinedMRTColumns<IMercariSubCategory>)
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined }))
} as StaticTableDefinitions<IMercariSubCategory>;