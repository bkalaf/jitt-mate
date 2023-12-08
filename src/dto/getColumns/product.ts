import { createMRTColumnHelper } from 'material-react-table';
import { IBarcode, IProduct } from '../../dal/types';
import { TextFieldElement } from 'react-hook-form-mui';
import { MRT_OIDCell } from '../../components/Table/Cells/MRT_OIDCell';
import { RHFM_UUIDCell } from '../../components/Table/Cells/RHFM_UUIDCell';
import { dbListMeta } from '../../components/Table/metas/dbListMeta';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { flagItemMeta } from '../../components/Table/flagItemMeta';
import { flagsMeta } from '../../components/Table/metas/flagsMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { floatMeta } from '../../components/Table/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { colorToName, colorToClasses } from '../../dal/enums/colors';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { RHFM_TextControl } from '../../components/Controls/RHFM_TextControl';
import { materialCompositionColumns } from './materialComposition';
import { productTaxonomyColumns } from './productTaxonomy';
import { Countries } from '../../dal/enums/countries';
import { $db } from '../../dal/db';

export const productHelper = createMRTColumnHelper<IProduct>()

export const productColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            productHelper.accessor('_id', objectIdMeta),
            productHelper.accessor('brand', {
                ...lookupMeta('brand', 'brand', 'name', { header: 'Brand' })
            }),
            productHelper.accessor('circa', {
                ...stringMeta({ propertyName: 'circa', header: 'Circa', maxLength: 4 })
            }),
            productHelper.accessor('classifier', {
                ...lookupMeta('classifier', 'classifier', 'name', { header: 'Classifier' })
            }),
            productHelper.accessor('color', {
                ...enumMeta('color', colorToName, { colorMap: colorToClasses, header: 'Color' })
            }),
            productHelper.accessor('descriptiveText', {
                ...stringMeta({ propertyName: 'descriptiveText', header: 'Descriptive Text' })
            }),
            productHelper.accessor('dimensions.capacityGB', {
                ...floatMeta('dimensions.capacityGB', { header: 'Capacity (GB)', min: 0, precision: 2, uom: 'GB' }),
                id: 'dimensions.capacityGB'
            }),
            productHelper.accessor((row: IProduct) => row.dimensions?.weightGrams ?? 0, {
                ...floatMeta('dimensions.weightGrams', { header: 'Diameter (in)', min: 0, precision: 2, uom: 'g' }),
                id: 'dimensions.weightGrams'
            }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.diameterInches ?? 0, {
            //     ...floatMeta('dimensions.diameterInches', { header: 'Diameter (in)', min: 0, precision: 2, uom: 'in' }),
            //     id: 'dimensions.diameterInches'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.heightInches ?? 0, {
            //     ...floatMeta('dimensions.heightInches', { header: 'Height (in)', min: 0, precision: 2, uom: 'in' }),
            //     id: 'dimensions.heightInches'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.inputAmperageAmps ?? 0, {
            //     ...floatMeta('dimensions.inputAmperageAmps', { header: 'Input Amperage (A)', min: 0, precision: 2, uom: 'A' }),
            //     id: 'dimensions.inputAmperageAmps'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.inputVoltageVolts ?? 0, {
            //     ...floatMeta('dimensions.inputVoltageVolts', { header: 'Input Voltage (V)', min: 0, precision: 2, uom: 'V' }),
            //     id: 'dimensions.inputVoltageVolts'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.inputWattageWatts ?? 0, {
            //     ...floatMeta('dimensions.inputWattageWatts', { header: 'Input Wattage (W)', min: 0, precision: 2, uom: 'W' }),
            //     id: 'dimensions.inputWattageWatts'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.lengthInches ?? 0, {
            //     ...floatMeta('dimensions.lengthInches', { header: 'Length (in)', min: 0, precision: 2, uom: 'in' }),
            //     id: 'dimensions.lengthInches'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.outputAmperageAmps ?? 0, {
            //     ...floatMeta('dimensions.outputAmperageAmps', { header: 'Output Amperage (A)', min: 0, precision: 2, uom: 'A' }),
            //     id: 'dimensions.outputAmperageAmps'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.outputVoltageVolts ?? 0, {
            //     ...floatMeta('dimensions.outputVoltageVolts', { header: 'Output Voltage (V)', min: 0, precision: 2, uom: 'V' })
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.outputWattageWatts ?? 0, {
            //     ...floatMeta('dimensions.outputWattageWatts', { header: 'Output Wattage (W)', min: 0, precision: 2, uom: 'W' }),
            //     id: 'dimensions.outputWattageWatts'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.runtimeMin ?? 0, {
            //     ...floatMeta('dimensions.runtimeMin', { header: 'Runtime (min)', min: 0, precision: 2, uom: 'min' }),
            //     id: 'dimensions.runtimeMin'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.volumeFlOz ?? 0, {
            //     ...floatMeta('dimensions.volumeFlOz', { header: 'Volume (flOz)', min: 0, precision: 2, uom: 'flOz' }),
            //     id: 'dimensions.volumeFlOz'
            // }),
            // productHelper.accessor((row: IProduct) => row.dimensions?.widthInches ?? 0, {
            //     ...floatMeta('dimensions.widthInches', { header: 'Width (in)', min: 0, precision: 2, uom: 'in' }),
            //     id: 'dimensions.widthInches'
            // }),
            productHelper.accessor('features', {
                ...dbListMeta<Record<'value', string>>('features', 'string', {
                    header: 'Features',
                    ItemComponent: ({ payload }) => payload?.value ?? '',
                    parentObjectType: 'product'
                })
            }),
            productHelper.accessor('flags', {
                ...flagsMeta()
            }),
            productHelper.accessor((row: IProduct) => row.flags.has('isAthletic'), flagItemMeta('isAthletic')),
            productHelper.accessor((row: IProduct) => row.flags.has('isCollectible'), flagItemMeta('isCollectible')),
            productHelper.accessor((row: IProduct) => row.flags.has('isDecorative'), flagItemMeta('isDecorative')),
            productHelper.accessor((row: IProduct) => row.flags.has('isDiscontinued'), flagItemMeta('isDiscontinued')),
            productHelper.accessor((row: IProduct) => row.flags.has('isGraphic'), flagItemMeta('isGraphic')),
            productHelper.accessor((row: IProduct) => row.flags.has('isMediaMail'), flagItemMeta('isMediaMail')),
            productHelper.accessor((row: IProduct) => row.flags.has('isMissingTags'), flagItemMeta('isMissingTags')),
            productHelper.accessor((row: IProduct) => row.flags.has('isRare'), flagItemMeta('isRare')),
            productHelper.accessor((row: IProduct) => row.flags.has('isVintage'), flagItemMeta('isVintage')),
            productHelper.accessor('folder', {
                header: 'Folder',
                Cell: RHFM_UUIDCell,
                Edit: RHFM_TextControl('folder', 'Folder', undefined, undefined, undefined, true, true, 'text')
            }),
            ...materialCompositionColumns.getColumns('materials'),
            productHelper.accessor('modelNo', {
                ...stringMeta({ propertyName: 'modelNo', header: 'Model #' })
            }),
            productHelper.accessor('notes', {
                ...stringMeta({ propertyName: 'notes', header: 'Notes', maxLength: 200 })
            }),
            productHelper.accessor('origin', {
                ...enumMeta('origin', Countries, { header: 'Origin' })
            }),
            productHelper.accessor('productLine', {
                ...lookupMeta('productLine', 'productLine', 'name', { header: 'Product Line' })
            }),
            productHelper.accessor('styleNo', {
                ...stringMeta({ propertyName: 'styleNo', header: 'Style #' })
            }),
            ...productTaxonomyColumns.getColumns('taxon'),
            productHelper.accessor('upcs', {
                ...dbListMeta('upcs', $db.barcode(), {
                    parentObjectType: 'product',
                    ItemComponent: ({ payload }: { payload: IBarcode }) => payload.scanValue,
                    header: 'UPCS'
                })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IProduct>;