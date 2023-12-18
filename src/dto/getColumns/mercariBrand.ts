import { IHashTag, IMercariBrand } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const mercariBrandColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IMercariBrand> =>
        (
            [
                $metas.oid,
                $metas.string('name', { required: true, maxLength: 100 }),
                $metas.set<IMercariBrand, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false)
            ] as DefinedMRTColumns<IMercariBrand>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IMercariBrand>
} as StaticTableDefinitions<IMercariBrand>;
