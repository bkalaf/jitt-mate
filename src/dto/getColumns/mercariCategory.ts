import { MRT_ColumnDef, createMRTColumnHelper } from 'material-react-table';
import { IHashTag, IMercariCategory } from '../../dal/types';
import { dataStructureMeta } from '../../components/Table/dataStructureMeta';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { percentageMeta } from '../../components/Table/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { productTaxonomyColumns } from './productTaxonomy';

export const mercariCategoryHelper = createMRTColumnHelper<IMercariCategory>();

export const mercariCategoryColumns = {
    getColumns: (...pre: string[]) =>
        [
            mercariCategoryHelper.accessor('_id', objectIdMeta),
            mercariCategoryHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', maxLength: 50, required: true, header: 'Name' })
            }),
            mercariCategoryHelper.accessor('id', {
                ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
            }),
            mercariCategoryHelper.accessor('hashTags', {
                ...dataStructureMeta<IMercariCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariCategory', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
            }),
            mercariCategoryHelper.accessor('shipWeightPercent', {
                ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            ...(productTaxonomyColumns.getColumns('taxon') as DefinedMRTColumns<IMercariCategory>)
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IMercariCategory>[]
} as StaticTableDefinitions<IMercariCategory>;