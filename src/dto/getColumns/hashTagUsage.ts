import { createMRTColumnHelper } from 'material-react-table';
import { IHashTagUsage } from '../../dal/types';
import { dateMeta } from '../../components/Table/dateMeta';
import { intMeta } from '../../components/Table/metas/intMeta';

export const hashTagUsageHelper = createMRTColumnHelper<IHashTagUsage>();
export const hashTagUsageColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            hashTagUsageHelper.accessor('count', {
                ...intMeta('count', { min: 0 })
            }),
            hashTagUsageHelper.accessor('from', {
                ...dateMeta('from', { header: 'Timestamp' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IHashTagUsage>;