import { createMRTColumnHelper } from 'material-react-table';
import { IHashTag, ISku } from '../../dal/types';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';
import { $metas } from '../../components/Table/metas';
import { ItemConditions, ItemConditionsColorMap, ItemConditionsEnumMap } from '../../dal/enums/itemConditions';
import { $db } from '../../dal/db';
import { RHFM_ImageListControl } from '../../components/Table/Controls/RHFM_ImageListControl';
import { RHFM_ImageListCell } from '../../components/Table/RHFM_ImageListCell';

const skuHelper = createMRTColumnHelper<ISku>();

export const skuColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            skuHelper.accessor('_id', objectIdMeta),
            skuHelper.accessor('upcs', $metas.list('upcs', 'scanValue', 'sku', 'barcode', { header: 'UPCS' })),
            skuHelper.accessor('product', {
                ...$metas.lookup('product', 'product', 'summaryName', {
                    header: 'Product'
                })
            }),
            skuHelper.accessor('price', {
                ...$metas.dollar('price', { header: 'Price' })
            }),
            skuHelper.accessor('condition', {
                ...$metas.enum('condition', ItemConditionsEnumMap, { colorMap: ItemConditionsColorMap, header: 'Item Condition' })
            }),
            skuHelper.accessor('defects', $metas.list('defects', 'value', 'sku', 'string', { header: 'Defects' })),
            skuHelper.accessor('skuPrinted', $metas.bool({ propertyName: 'skuPrinted', header: 'Printed' })),
            skuHelper.accessor('scans', $metas.list('scans', 'output', 'sku', $db.scan() as RealmObjects, { header: 'Scans' })),
            skuHelper.accessor('productImages', {
                header: 'Images',
                Cell: RHFM_ImageListCell as DefinedMRTColumn<ISku>['Cell'],
                Edit: RHFM_ImageListControl<ISku>('productImages', 'sku', { header: 'Images' }) as DefinedMRTColumn<ISku>['Edit']
            }),
            skuHelper.accessor('shipWeightPercent', {
                ...$metas.percent('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            skuHelper.accessor('hashTags', {
                ...$metas.set<ISku, IHashTag, 'hashTags'>('hashTags', 'name', 'sku', 'hashTag', { header: 'Hash Tags' })
            }),
            
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
};
