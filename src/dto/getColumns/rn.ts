import { createMRTColumnHelper } from 'material-react-table';
import { IAddress, IBrand, IRn } from '../../dal/types';
import { RnNumberTypesInfos } from '../../dal/enums/rnNumberType';
import { $metas } from '../../components/Table/metas';

export const rnHelper = createMRTColumnHelper<IRn>();

export const rnColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IRn> =>
        (
            [
                $metas.oid,
                $metas.string('companyName', {}, false),
                $metas.string('legalBusinessName', {}, false),
                $metas.string('companyType', {}, false),
                $metas.int('rnNo', { min: 0, max: 300000, required: true }, false),
                $metas.enum('noType', { enumMap: RnNumberTypesInfos, header: 'RN # Types' }, false),
                $metas.string('productLine', {}, false),
                $metas.string('material', {}, false),
                $metas.string('url', { type: 'url' }, false),
                $metas.flags('flags', { flags: ['isImporter', 'isRetailer', 'isManufacturing', 'isInternet', 'isOther', 'isMailOrder', 'isWholeSale'] }, false),
                $metas.lookup<IRn, IBrand>('brand', { objectType: 'brand', labelPropertyName: 'name' }, false),
                $metas.list<IRn, IAddress, 'addresses'>('addresses', { labelProperty: 'output', objectType: 'rn', ofObjectType: 'address' }, false)
            ] as DefinedMRTColumns<IRn>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IRn>
} as StaticTableDefinitions<IRn>;
