import { createMRTColumnHelper } from 'material-react-table';
import { boolMeta } from '../../components/Table/metas/boolMeta';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { BarcodeTypes, BarcodeTypesColors } from '../../dal/enums/barcodeTypes';
import { IBarcode } from '../../dal/types';

export const barcodeHelper = createMRTColumnHelper<IBarcode>();

export const barcodeColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            barcodeHelper.accessor('rawValue', {
                ...stringMeta({ propertyName: 'rawValue', header: 'Raw Value', maxLength: 13 })
            }),
            barcodeHelper.accessor('type', {
                ...enumMeta('type', BarcodeTypes, { colorMap: BarcodeTypesColors, header: 'Barcode Type' }),
                enableEditing: false
            }),
            barcodeHelper.accessor('valid', {
                ...boolMeta({ propertyName: 'valid', readOnly: true, header: 'Is Valid' }),
                enableEditing: false
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IBarcode>;