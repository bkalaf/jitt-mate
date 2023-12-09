import { createMRTColumnHelper } from 'material-react-table';
import { IHashTag, IMercariBrand } from '../../dal/types';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { $metas } from '../../components/Table/metas';

export const mercariBrandHelper = createMRTColumnHelper<IMercariBrand>();

export const mercariBrandColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            mercariBrandHelper.accessor('_id', objectIdMeta),
            mercariBrandHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
            }),
            mercariBrandHelper.accessor('hashTags', {
                ...$metas.set<IMercariBrand, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariBrand', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IMercariBrand>;