import { createMRTColumnHelper } from 'material-react-table';
import { boolDefinition } from '../../components/Table/metas/$boolDefinition';
import { enumDefinition } from '../../components/Table/metas/$enumDefinition';
import { BarcodeTypes, BarcodeTypesColors } from '../../dal/enums/barcodeTypes';
import { IBarcode } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const barcodeHelper = createMRTColumnHelper<IBarcode>();

// export const barcodeColumns = {
//     getColumns: (...pre: string[]): DefinedMRTColumns =>
//         [
//             $metas.string('rawValue', { maxLength: 13, required: true }, false),
//             $metas.barcode()
//             barcodeHelper.accessor('rawValue', {
//                 ...stringDefinition({ propertyName: 'rawValue', header: 'Raw Value', maxLength: 13 })
//             }),
//             barcodeHelper.accessor('type', {
//                 ...enumDefinition('type', BarcodeTypes, { colorMap: BarcodeTypesColors, header: 'Barcode Type' }),
//                 enableEditing: false
//             }),
//             barcodeHelper.accessor('valid', {
//                 ...boolDefinition({ propertyName: 'valid', readOnly: true, header: 'Is Valid' }),
//                 enableEditing: false
//             })
//         ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
// } as StaticTableDefinitions<IBarcode>;