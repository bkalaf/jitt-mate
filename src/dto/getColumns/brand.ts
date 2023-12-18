import { createMRTColumnHelper } from 'material-react-table';
import { IBrand, IMercariBrand, IHashTag } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const brandHelper = createMRTColumnHelper<IBrand>();
export const brandColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IBrand> =>
        (
            [
                $metas.oid,
                $metas.string('name', { required: true, maxLength: 100 }, false),
                $metas.string('folder', { fn: (x: IBrand) => x.folder }, false),
                $metas.lookup<IBrand, IMercariBrand>('mercariBrand', { objectType: 'mercariBrand', labelPropertyName: 'name' }, false),
                $metas.string('website', { maxLength: 150, type: 'url', header: 'URL' }, false),
                $metas.lookup<IBrand, IBrand>('parent', { objectType: 'brand', labelPropertyName: 'name' }, false),
                $metas.set<IBrand, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false)
            ] as DefinedMRTColumns<IBrand>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IBrand>
} as StaticTableDefinitions<IBrand>;
