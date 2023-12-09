import { MRT_ColumnDef, createMRTColumnHelper } from 'material-react-table';
import { IProductTaxonomy } from '../../dal/types';
import { RHFM_TaxonSelect } from '../../components/Table/Controls/RHFM_TaxonSelect';
import { boolMeta } from '../../components/Table/metas/boolMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';

const productTaxonomyHelper = createMRTColumnHelper<IProductTaxonomy>();
export const productTaxonomyColumns = {
    getColumns: (...pre: string[]) =>
        [
            productTaxonomyHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name' })
            }),
            productTaxonomyHelper.accessor('kingdom', {
                header: 'Kingdom',
                Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
            }),
            productTaxonomyHelper.accessor('phylum', {
                header: 'Phlyum',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('klass', {
                header: 'Class',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('order', {
                header: 'Order',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('family', {
                header: 'Family',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('genus', {
                header: 'Genus',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('species', {
                header: 'Species',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('lock', boolMeta<IProductTaxonomy>({ propertyName: 'lock', header: 'Is Locked' }))
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IProductTaxonomy>[]
} as StaticTableDefinitions<IProductTaxonomy>;