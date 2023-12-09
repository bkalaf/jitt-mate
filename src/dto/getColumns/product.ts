import { MRT_ColumnDef, createMRTColumnHelper } from 'material-react-table';
import { IBarcode, IHashTag, IMaterialComposition, IProduct } from '../../dal/types';
import { RHFM_UUIDCell } from '../../components/Table/Cells/RHFM_UUIDCell';
import { dbListMeta } from '../../components/Table/metas/dbListMeta';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { flagItemMeta } from '../../components/Table/metas/flagItemMeta';
import { flagsMeta } from '../../components/Table/metas/flagsMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { colorToName, colorToClasses } from '../../dal/enums/colors';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';
import { RHFM_TextControl } from '../../components/Controls/RHFM_TextControl';
import { materialCompositionColumns } from './materialComposition';
import { productTaxonomyColumns } from './productTaxonomy';
import { Countries } from '../../dal/enums/countries';
import { $db } from '../../dal/db';
import { getProperty } from '../../components/Contexts/getProperty';
import { is } from '../../dal/is';
import { $metas } from './../../components/Table/metas';
export const productHelper = createMRTColumnHelper<IProduct>();

export function has(name: string) {
    return function (obj?: Record<string, any>) {
        if (obj != null && is.dbSet(obj)) {
            return obj.has(name);
        }
        return Object.getOwnPropertyNames(obj ?? {}).includes(name);
    };
}
export function entityHas<T extends AnyObject>(propertyName: string, name: string) {
    return function (obj?: T) {
        if (obj != null) {
            const value = getProperty(propertyName)(obj) ?? {};
            return has(name)(value);
        }
        return false;
    };
}
export const productColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            productHelper.accessor('_id', objectIdMeta),
            productHelper.accessor('productLine', {
                ...lookupMeta('productLine', 'productLine', 'name', { header: 'Product Line' }, ['disable', 'brand', (x) => x != null])
            }),
            productHelper.accessor('brand', {
                ...lookupMeta('brand', 'brand', 'name', { header: 'Brand' }, ['disable', 'productLine', (x) => x != null])
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
            productHelper.group({
                header: 'Dimensions',
                columns: [
                    productHelper.accessor((x: any) => getProperty('dimensions.weightGrams')(x) ?? 0, {
                        ...$metas.float('dimensions.weightGrams', { header: 'Weight (g)', min: 0, precision: 2, uom: 'g' }),
                        id: 'dimensions.weightGrams'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.capacityGB')(x) ?? 0, {
                        ...$metas.float('dimensions.capacityGB', { header: 'Capacity (GB)', min: 0, precision: 2, uom: 'GB' }, ['disable', 'taxon.kingdom', (x: any) => x !== 'electronics']),
                        id: 'dimensions.capacityGB'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.lengthInches')(x) ?? 0, {
                        ...$metas.float('dimensions.lengthInches', { header: 'Length (in)', min: 0, precision: 2, uom: 'in' }),
                        id: 'dimensions.lengthInches'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.widthInches')(x) ?? 0, {
                        ...$metas.float('dimensions.widthInches', { header: 'Width (in)', min: 0, precision: 2, uom: 'in' }, ['disable', 'dimensions.diameterInches', (x) => x != null && x !== 0]),
                        id: 'dimensions.widthInches'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.diameterInches')(x) ?? 0, {
                        ...$metas.float('dimensions.diameterInches', { header: 'Diameter (in)', min: 0, precision: 2, uom: 'in' }, ['disable', 'dimensions.widthInches', (x) => x != null && x !== 0]),
                        id: 'dimensions.diameterInches'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.heightInches')(x) ?? 0, {
                        ...$metas.float('dimensions.heightInches', { header: 'Height (in)', min: 0, precision: 2, uom: 'in' }, ['disable', 'dimensions.diameterInches', (x) => x != null && x !== 0]),
                        id: 'dimensions.heightInches'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.runtimeMin')(x) ?? 0, {
                        ...$metas.float(
                            'dimensions.runtimeMin',
                            {
                                header: 'Runtime (min)',
                                min: 0,
                                precision: 0 as any,
                                uom: 'min'
                            },
                            ['disable', 'taxon.phylum', (x) => x !== 'videos']
                        ),
                        id: 'dimensions.runtimeMin'
                    }),
                    productHelper.accessor((x: any) => getProperty('dimensions.volumeFlOz')(x) ?? 0, {
                        ...$metas.float(
                            'dimensions.volumeFlOz',
                            {
                                header: 'Runtime (min)',
                                min: 0,
                                precision: 2,
                                uom: 'flOz'
                            },
                            ['disable', 'taxon.phylum', (x) => x !== 'videos']
                        ),
                        id: 'dimensions.volumeFlOz'
                    })
                ]
            }),
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

            // productHelper.accessor((row: IProduct) => row.dimensions?.volumeFlOz ?? 0, {
            //     ...floatMeta('dimensions.volumeFlOz', { header: 'Volume (flOz)', min: 0, precision: 2, uom: 'flOz' }),
            //     id: 'dimensions.volumeFlOz'
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
            productHelper.group({
                header: 'Flags',
                columns: [
                    productHelper.accessor(entityHas('flags', 'isAthletic'), flagItemMeta('isAthletic')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isCollectible'), flagItemMeta('isCollectible')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isDecorative'), flagItemMeta('isDecorative')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isDiscontinued'), flagItemMeta('isDiscontinued')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isGraphic'), flagItemMeta('isGraphic')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isMediaMail'), flagItemMeta('isMediaMail')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isMissingTags'), flagItemMeta('isMissingTags')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isRare'), flagItemMeta('isRare')) as MRT_ColumnDef<IProduct, unknown>,
                    productHelper.accessor(entityHas('flags', 'isVintage'), flagItemMeta('isVintage')) as MRT_ColumnDef<IProduct, unknown>
                ]
            }),
            productHelper.accessor('folder', {
                header: 'Folder',
                Cell: RHFM_UUIDCell,
                Edit: RHFM_TextControl('folder', 'Folder', undefined, undefined, undefined, true, true, 'text')
            }),
            // ...materialCompositionColumns.getColumns('materials'),
            productHelper.accessor('materials', {
                ...$metas.dictionary<IProduct, IMaterialComposition, 'materials', 'toOutput'>('materials', 'toOutput', 'product', 'materialComposition', { header: 'Made Of' })
            }),
            productHelper.accessor('modelNo', {
                ...stringMeta({ propertyName: 'modelNo', header: 'Model #' })
            }),
            productHelper.accessor('notes', {
                ...stringMeta({ propertyName: 'notes', header: 'Notes', maxLength: 200 })
            }),
            productHelper.accessor('origin', {
                ...enumMeta('origin', Countries, { header: 'Origin' })
            }),
            productHelper.accessor('styleNo', {
                ...stringMeta({ propertyName: 'styleNo', header: 'Style #' })
            }),
            productHelper.accessor('shipWeightPercent', {
                ...$metas.percent('shipWeightPercent', { header: 'Ship Weight %' })
            }),
            productHelper.group({
                header: 'Taxonomy',
                columns: productTaxonomyColumns.getColumns('taxon') as DefinedMRTColumns<IProduct>
            }),
            productHelper.accessor('hashTags', {
                ...$metas.set<IProduct, IHashTag, 'hashTags'>('hashTags', 'name', 'product', 'hashTag', { header: 'Hash Tags' })
            }),
            productHelper.accessor('upcs', {
                ...dbListMeta('upcs', $db.barcode(), {
                    parentObjectType: 'product',
                    ItemComponent: ({ payload }: { payload: IBarcode }) => payload.scanValue,
                    header: 'UPCS'
                })
            })
        ].map((x: any) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IProduct>;
