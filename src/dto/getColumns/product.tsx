import { IBrand, IClassifier, IHashTag, IMaterialComposition, IProduct, IProductLine } from '../../dal/types';
import { colorToName, colorToClasses } from '../../dal/enums/colors';
import { Countries } from '../../dal/enums/countries';
import { getProperty } from '../../components/Contexts/getProperty';
import { is } from '../../dal/is';
import { $metas } from '../../components/Table/metas';
import { toDisableDependency } from '../../components/Table/toDependency';
import { enableWhen } from './enableWhen';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { checkTransaction } from '../../util/checkTransaction';

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
export function getValueDict(name: string, dict: DBDictionary<any> | Record<string, any>) {
    if (is.dbDictionary(dict)) {
        return dict.toJSON()[name] ?? null;
    }
    if (Object.getOwnPropertyNames(dict ?? {}).includes(name)) {
        return dict[name] ?? null;
    }
    return null;
}
export const productColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IProduct> =>
        (
            [
                $metas.oid,
                $metas.barcode('upcs', {}, false),
                $metas.lookup<IProduct, IProductLine>(
                    'productLine',
                    { objectType: 'productLine', labelPropertyName: 'name', onChange: (formContext: UseFormReturn<FieldValues>, db: Realm) => (ev: React.ChangeEvent, newValue: any) => {
                        const func = () => {
                            const values = formContext.getValues() as any as IProduct;
                            formContext.setValue('taxon.kingdom', newValue?.taxon?.kingdom ?? null);
                            formContext.setValue('taxon.phylum', newValue?.taxon?.phylum ?? null);
                            formContext.setValue('taxon.klass', newValue?.taxon?.klass ?? null);
                            formContext.setValue('taxon.order', newValue?.taxon?.order ?? null);
                            formContext.setValue('taxon.family', newValue?.taxon?.family ?? null);
                            formContext.setValue('taxon.genus', newValue?.taxon?.genus ?? null);
                            formContext.setValue('taxon.species', newValue?.taxon?.species ?? null);
                        }
                        checkTransaction(db)(func);
                    } },
                    false,
                    toDisableDependency('brand', (x) => x != null)
                ),
                $metas.lookup<IProduct, IBrand>(
                    'brand',
                    { objectType: 'brand', labelPropertyName: 'name' },
                    false,
                    toDisableDependency('productLine', (x) => x != null)
                ),
                $metas.lookup<IProduct, IClassifier>('classifier', { objectType: 'classifier', labelPropertyName: 'name' }, false),
                $metas.string('descriptiveText', { maxLength: 100 }, false),
                $metas.string('circa', { maxLength: 4 }, false),
                $metas.enum('color', { enumMap: colorToName, colorMap: colorToClasses }, false),
                {
                    header: 'Dimensions',
                    columns: [
                        $metas.float(
                            'dimensions.weightGrams',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'in',
                                header: 'Weight (g)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            false
                        ),
                        $metas.float(
                            'dimensions.capacityGB',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'GB',
                                header: 'Capacity (GB)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            true
                        ),
                        $metas.float(
                            'dimensions.lengthInches',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'in',
                                header: 'Length (in)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            false
                        ),
                        $metas.float(
                            'dimensions.diameterInches',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'in',
                                header: 'Diameter (in)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            false,
                            toDisableDependency('dimensions.widthInches', (x) => x != null && x !== 0)
                        ),
                        $metas.float(
                            'dimensions.widthInches',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'in',
                                header: 'Width (in)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            false,
                            toDisableDependency('dimensions.diameterInches', (x) => x != null && x !== 0)
                        ),
                        $metas.float(
                            'dimensions.heightInches',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'in',
                                header: 'Height (in)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            false,
                            toDisableDependency('dimensions.diameterInches', (x) => x != null && x !== 0)
                        ),
                        $metas.float(
                            'dimensions.runtimeMin',
                            {
                                min: 0,
                                precision: 1,
                                uom: 'min',
                                header: 'Runtime (min)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            true,
                            enableWhen('taxon.phylum', 'videos')
                        ),
                        $metas.float(
                            'dimensions.volumeFlOz',
                            {
                                min: 0,
                                precision: 2,
                                uom: 'flOz',
                                header: 'Volume (flOz)',
                                fn: (x: IProduct) => getValueDict('weightGrams', x.dimensions)
                            },
                            true,
                            enableWhen('taxon.phylum', 'videos')
                        )
                    ]
                },
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

                $metas.list<IProduct, string, 'features'>('features', { objectType: 'product', ofObjectType: 'string', labelProperty: ({ data }: { data: string }) => data }, false),
                $metas.flags('flags', { flags: ['isAthletic', 'isCollectible', 'isDecorative', 'isGraphic', 'isMediaMail', 'isMissingTags', 'isRare', 'isVintage'] }, false),
                $metas.string('folder', { fn: (x: IProduct) => x.folder?.toHexString(true) ?? null, readOnly: true }, false),
                $metas.dictionary<IProduct, IMaterialComposition, 'materials', 'toOutput'>('materials', {
                    objectType: 'product',
                    ofObjectType: 'materialComposition',
                    header: 'Made Of',
                    labelProperty: ({ data }: { data: IMaterialComposition }) => <span>{data.toOutput}</span>
                }),
                $metas.string('modelNo', { header: 'Model #' }, false),
                $metas.string('notes', { maxLength: 200 }, false),
                $metas.enum('origin', { enumMap: Countries }, false),
                $metas.string('styleNo', { header: 'Style #' }, false),
                $metas.embed<IProduct>('apparelDetails', { getColumnsKey: 'apparelDetails' }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.percent<IProduct>('shipWeightPercent', { min: 1, max: 2 }, false),
                $metas.embed<IProduct>('taxon', { getColumnsKey: 'productTaxonomy' }, false),
                $metas.set<IProduct, IHashTag, 'hashTags'>('hashTags', 'brand', 'hashTag', 'name', {}, false)
            ] as DefinedMRTColumns<IProduct>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IProduct>
} as StaticTableDefinitions<IProduct>;
