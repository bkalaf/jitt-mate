import { IBrand, IHashTag, IProductLine } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const productLineColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IProductLine> =>
        (
            [
                $metas.oid,
                $metas.lookup<IProductLine, IBrand>('brand', { objectType: 'brand', labelPropertyName: 'name' }, false),
                $metas.string('name', { required: true, maxLength: 50 }),
                $metas.set<IProductLine, IHashTag, 'hashTags'>('hashTags', 'productLine', 'hashTag', 'name', {}, false)
            ] as DefinedMRTColumns<IProductLine>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IProductLine>
} as StaticTableDefinitions<IProductLine>;