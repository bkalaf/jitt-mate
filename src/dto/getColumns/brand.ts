import { createMRTColumnHelper } from 'material-react-table';
import { dataStructureMeta } from '../../components/Table/dataStructureMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { IBrand, IMercariBrand, IHashTag } from '../../dal/types';

export const brandHelper = createMRTColumnHelper<IBrand>();
export const brandColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            brandHelper.accessor('_id', objectIdMeta),
            brandHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
            }),
            brandHelper.accessor('folder', {
                ...stringMeta({ propertyName: 'folder', header: 'Folder' })
            }),
            brandHelper.accessor('mercariBrand', {
                ...lookupMeta<IMercariBrand, IBrand>('mercariBrand', 'mercariBrand', 'name', { header: 'Mercari Brand' })
            }),
            brandHelper.accessor('website', {
                ...stringMeta({ propertyName: 'website', header: 'URL', type: 'url' })
            }),
            brandHelper.accessor('parent', {
                ...lookupMeta<IBrand, IBrand>('parent', 'brand', 'name', { header: 'Parent' })
            }),
            brandHelper.accessor('hashTags', {
                ...dataStructureMeta<IBrand, IHashTag, 'hashTags'>('hashTags', 'name', 'brand', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IBrand>;
