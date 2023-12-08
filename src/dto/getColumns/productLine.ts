import { MRT_ColumnDef, createMRTColumnHelper } from 'material-react-table';
import { IBrand, IProductLine } from '../../dal/types';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';

export const productLineHelper = createMRTColumnHelper<IProductLine>();

export const productLineColumns = {
    getColumns: (...pre: string[]): MRT_ColumnDef<IProductLine, any>[] =>
        [
            productLineHelper.accessor('_id', objectIdMeta),
            productLineHelper.accessor('name', {
                ...stringMeta({
                    propertyName: 'name',
                    header: 'Name',
                    required: true,
                    maxLength: 50
                })
            }),
            productLineHelper.accessor('brand', {
                ...lookupMeta<IBrand, IProductLine>('brand', 'brand', 'name', { header: 'Brand' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IProductLine, any>[]
} as StaticTableDefinitions<IProductLine>;