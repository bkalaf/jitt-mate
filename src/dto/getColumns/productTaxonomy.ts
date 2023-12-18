import { MRT_ColumnDef } from 'material-react-table';
import { IProductTaxonomy } from '../../dal/types';
import { RHFM_TaxonSelect } from '../../components/Table/Controls/RHFM_TaxonSelect';
import { $metas } from '../../components/Table/metas';

export const productTaxonomyColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IProductTaxonomy> =>
        (
            [
                $metas.bool('lock', { header: 'Is Locked' }, false),
                $metas.string('name', { readOnly: true }, false),
                {
                    accessorKey: 'kingdom',
                    header: 'Kingdom',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'phylum',
                    header: 'Phylum',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'klass',
                    header: 'Class',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'order',
                    header: 'Order',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'family',
                    header: 'Family',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'genus',
                    header: 'Genus',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'species',
                    header: 'Species',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                }
            ] as DefinedMRTColumns<IProductTaxonomy>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IProductTaxonomy>
} as StaticTableDefinitions<IProductTaxonomy>;
