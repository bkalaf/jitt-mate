import { createMRTColumnHelper } from 'material-react-table';
import { IAddress } from '../../dal/types';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { Countries } from '../../dal/enums/countries';
import { Provinces } from '../../dal/enums/provinces';

const addressHelper = createMRTColumnHelper<IAddress>();

export const addressColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            addressHelper.accessor('city', {
                ...stringMeta({ propertyName: 'city', header: 'City' })
            }),
            addressHelper.accessor('country', {
                ...enumMeta('country', Countries, { header: 'Country' })
            }),
            addressHelper.accessor('line1', {
                ...stringMeta({ propertyName: 'line1', header: 'Line #1' })
            }),
            addressHelper.accessor('line2', {
                ...stringMeta({ propertyName: 'line2', header: 'Line #2' })
            }),
            addressHelper.accessor('postalCode', {
                ...stringMeta({ propertyName: 'postalCode', header: 'Postal Code' })
            }),
            addressHelper.accessor('province', {
                ...enumMeta('province', Provinces, { header: 'Province/State' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IAddress>;
