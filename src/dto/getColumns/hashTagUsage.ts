import { IHashTagUsage } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const hashTagUsageColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IHashTagUsage> =>
        (
            [
                $metas.int('count', { min: 0 }, false),
                $metas.date('from', { type: 'datetime-local' }, false)
            ] as DefinedMRTColumns<IHashTagUsage>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IHashTagUsage>
} as StaticTableDefinitions<IHashTagUsage>;