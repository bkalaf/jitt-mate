import { IHashTag, IProduct, IProductImage, IScan, ISku } from '../../dal/types';
import { $metas } from '../../components/Table/metas';
import { ItemConditionsColorMap, ItemConditionsEnumMap } from '../../dal/enums/itemConditions';
import Realm from 'realm';

export const skuColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            $metas.oid,
            $metas.barcode('upcs', { header: 'SKUS' }, false),
            $metas.lookup<ISku, IProduct>(
                'product',
                {
                    objectType: 'product',
                    labelPropertyName: (x: IProduct) =>
                        ([x.productLine?.brand?.name, x.brand?.name, x.taxon?.name, x.descriptiveText].filter((x) => x != null) as string[]).join('-').replaceAll(' ', '-').toLowerCase() as string
                },
                false
            ),
            $metas.dollar('price', { required: true, min: 0 }, false),
            $metas.enum('condition', { enumMap: ItemConditionsEnumMap, colorMap: ItemConditionsColorMap }, false),
            $metas.bool('skuPrinted', { header: 'Label Printed', defaultValue: false }, false),
            $metas.list<ISku, string, 'defects'>('defects', { objectType: 'sku', ofObjectType: 'string', labelProperty: ({ data }: { data: string }) => data }, false),
            $metas.list<ISku, IScan, 'scans'>('scans', { labelProperty: 'output', objectType: 'sku', ofObjectType: 'scan' }, false),
            $metas.percent<ISku>('shipWeightPercent', { min: 1, max: 2 }, false),
            $metas.set<ISku, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false),
            $metas.image<ISku>(
                (obj: Realm.Object<ISku> & ISku): DBBacklink<IProductImage> | null => {
                    if (obj instanceof Realm.Object) {
                        return obj.linkingObjects<IProductImage>('productImage', 'sku');
                    }
                    return null;
                },
                { id: 'productImages' },
                false
            )
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
};
