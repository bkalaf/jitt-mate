import { createMRTColumnHelper } from 'material-react-table';
import { dateMeta } from '../../components/Table/metas/dateMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { IScan } from '../../dal/types';

const scanHelper = createMRTColumnHelper<IScan>();
export const scanColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            scanHelper.accessor('fixture', {
                ...lookupMeta('fixture', 'locationSegment', 'name', { header: 'Fixture' })
            }),
            scanHelper.accessor('shelf', {
                ...lookupMeta('shelf', 'locationSegment', 'name', { header: 'Shelf' })
            }),
            scanHelper.accessor('bin', {
                ...lookupMeta('bin', 'locationSegment', 'name', { header: 'Bin' })
            }),
            scanHelper.accessor('timestamp', {
                ...dateMeta('timestamp', { header: 'Timestamp' })
            })
        ].map((x) => ({
            ...x,
            accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined
        })) as DefinedMRTColumns
} as StaticTableDefinitions<IScan>;