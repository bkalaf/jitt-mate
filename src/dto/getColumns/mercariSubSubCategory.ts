import { MRT_ColumnDef, createMRTColumnHelper } from 'material-react-table';
import { IHashTag, IMercariSubCategory, IMercariSubSubCategory } from '../../dal/types';
import { productTaxonomyColumns } from './productTaxonomy';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';
import { percentageMeta } from '../../components/Table/metas/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { $metas } from '../../components/Table/metas';

export const mercariSubSubCategoryHelper = createMRTColumnHelper<IMercariSubSubCategory>();

export const mercariSubSubCategoryColumns = {
    getColumns: (...pre: string[]): MRT_ColumnDef<IMercariSubSubCategory, any>[] =>
        [
            mercariSubSubCategoryHelper.accessor('_id', objectIdMeta),
            mercariSubSubCategoryHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', maxLength: 50, required: true, header: 'Name' })
            }),
            mercariSubSubCategoryHelper.accessor('fullname', {
                ...stringMeta({ propertyName: 'fullname', header: 'Full Name' })
            }),
            mercariSubSubCategoryHelper.accessor('id', {
                ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
            }),
            mercariSubSubCategoryHelper.accessor('parent', {
                ...lookupMeta<IMercariSubCategory, IMercariSubSubCategory>('parent', 'mercariSubCategory', 'name', { header: 'Parent' })
            }),
            mercariSubSubCategoryHelper.accessor('hashTags', {
                ...$metas.set<IMercariSubSubCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariSubSubCategory', 'hashTag', { header: 'Hash Tags' })
            }),
            mercariSubSubCategoryHelper.accessor('shipWeightPercent', {
                ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            ...(productTaxonomyColumns.getColumns('taxon') as DefinedMRTColumns<IMercariSubSubCategory>)
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IMercariSubSubCategory, any>[]
} as StaticTableDefinitions<IMercariSubSubCategory>;