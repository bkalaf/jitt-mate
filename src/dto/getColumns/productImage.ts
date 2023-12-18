import { IProductImage, ISku } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const productImageColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IProductImage> =>
        (
            [
                $metas.oid,
                $metas.string<IProductImage>('uploadedFrom', { required: true }, false),
                $metas.bool('doNotRemoveBG', { defaultValue: false, header: 'ignore rembg' }, false),
                $metas.lookup<IProductImage, ISku>('sku', { objectType: 'sku', labelPropertyName: 'summaryName' }, false),
                $metas.string('effectivePath', { readOnly: true }, false)
            ] as DefinedMRTColumns<IProductImage>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IProductImage>
} as StaticTableDefinitions<IProductImage>;
