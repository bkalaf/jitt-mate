import { createMRTColumnHelper } from 'material-react-table';
import { IProductImage } from '../../dal/types';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';
import { boolMeta } from '../../components/Table/metas/boolMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';

export const productImageHelper = createMRTColumnHelper<IProductImage>()

export const productImageColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            productImageHelper.accessor('_id', objectIdMeta),
            productImageHelper.accessor('filename', {
                ...stringMeta({ propertyName: 'filename', header: 'FileName', readOnly: true })
            }),
            productImageHelper.accessor('doNotRemoveBG', {
                ...boolMeta({ propertyName: 'doNotRemoveBG', defaultValue: false, header: 'Do Not RemBG' })
            }),
            productImageHelper.accessor('sku', {
                ...lookupMeta('sku', 'sku', 'description', { header: 'SKU' })
            }),
            productImageHelper.accessor('effectivePath', {
                ...stringMeta({ propertyName: 'effectivePath', header: 'Effective Path', readOnly: true })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IProductImage>;