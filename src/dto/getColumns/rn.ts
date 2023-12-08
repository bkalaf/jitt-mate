import { MRT_ColumnDef, createMRTColumnHelper } from 'material-react-table';
import { IAddress, IRn } from '../../dal/types';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { key } from 'localforage';
import { boolMeta } from '../../components/Table/metas/boolMeta';
import { toAddress } from '../../components/Table/creators/$convertToRealm';
import { $initialCollection } from '../../components/Table/creators/$initialCollection';
import { dbListMeta } from '../../components/Table/metas/dbListMeta';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { intMeta } from '../../components/Table/intMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { $db } from '../../dal/db';
import { RnNumberTypes } from '../../dal/enums/rnNumberType';

export const rnHelper = createMRTColumnHelper<IRn>();

export const rnColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            rnHelper.accessor('_id', objectIdMeta),
            rnHelper.accessor('addresses', {
                ...dbListMeta<Entity<IAddress>>('addresses', $db.address(), {
                    header: 'Addresses',
                    ItemComponent: ({ payload }) =>
                        [payload.line1, payload.line2, [payload.cityState, payload.country].filter((x) => x != null).join(', '), payload.postalCode].filter((x) => x != null).join(', '),
                    parentObjectType: $db.rn()
                })
            }),
            rnHelper.accessor('brand', {
                ...lookupMeta('brand', 'brand', 'name', { header: 'Brand' })
            }),
            rnHelper.accessor('companyName', {
                ...stringMeta({ propertyName: 'companyName', header: 'Company Name' })
            }),
            rnHelper.accessor('companyType', {
                ...stringMeta({ propertyName: 'companyType', header: 'Company Type' })
            }),
            rnHelper.accessor('legalBusinessName', {
                ...stringMeta({ propertyName: 'legalBusinessName', header: 'Legal Business Name' })
            }),
            rnHelper.accessor('rnNo', {
                ...intMeta('rnNo', { header: 'RN #', min: 0 })
            }),
            rnHelper.accessor('noType', {
                ...enumMeta('noType', RnNumberTypes, { header: 'RN # Type' })
            }),
            rnHelper.accessor('productLine', {
                ...stringMeta({ propertyName: 'productLine', header: 'Product Line' })
            }),
            rnHelper.accessor('material', {
                ...stringMeta({ propertyName: 'material', header: 'Material' })
            }),
            rnHelper.accessor('url', {
                ...stringMeta({ propertyName: 'url', header: 'URL' })
            }),
            rnHelper.accessor('isImporter', {
                ...boolMeta({ propertyName: 'isImporter', defaultValue: false, header: 'Is Importer' })
            }),
            rnHelper.accessor('isInternet', {
                ...boolMeta({ propertyName: 'isInternet', defaultValue: false, header: 'Is Internet' })
            }),
            rnHelper.accessor('isMailOrder', {
                ...boolMeta({ propertyName: 'isMailOrder', defaultValue: false, header: 'Is Mail Order' })
            }),
            rnHelper.accessor('isManufacturer', {
                ...boolMeta({ propertyName: 'isManufacturer', defaultValue: false, header: 'Is Manufacturer' })
            }),
            rnHelper.accessor('isRetailer', {
                ...boolMeta({ propertyName: 'isRetailer', defaultValue: false, header: 'Is Retailer' })
            }),
            rnHelper.accessor('isWholesaler', {
                ...boolMeta({ propertyName: 'isWholesaler', defaultValue: false, header: 'Is Wholesaler' })
            }),
            rnHelper.accessor('isOther', {
                ...boolMeta({ propertyName: 'isOther', defaultValue: false, header: 'Is Other' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IRn>;