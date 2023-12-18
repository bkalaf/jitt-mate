import { ILocationSegment, IScan } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const scanColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IScan> =>
        (
            [
                $metas.lookup<IScan, ILocationSegment>('fixture', { labelPropertyName: 'name', objectType: 'locationSegment' }, false),
                $metas.lookup<IScan, ILocationSegment>('shelf', { labelPropertyName: 'name', objectType: 'locationSegment' }, false),
                $metas.lookup<IScan, ILocationSegment>('bin', { labelPropertyName: 'name', objectType: 'locationSegment' }, false),
                $metas.date('timestamp', { type: 'datetime-local' }, false)
            ] as DefinedMRTColumns<IScan>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IScan>
} as StaticTableDefinitions<IScan>;
