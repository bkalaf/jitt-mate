/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_ColumnDef } from 'material-react-table';
import {
    IBarcode,
    IBrand,
    IClassifier,
    IHashTag,
    IHashTagUsage,
    ILocationSegment,
    IMercariBrand,
    IMercariCategory,
    IMercariSubCategory,
    IMercariSubSubCategory,
    IProductImage,
    IProductLine,
    IProductTaxonomy
} from '../../dal/types';
import { MRT_OIDCell } from './Cells/MRT_OIDCell';
import helpers from './helpers';
import { DateCell } from './Cells/DateCell';
import { fromOID } from '../../dal/fromOID';
import { toOID } from '../../dal/toOID';
import { BSON } from 'realm';
import { RHFM_TextControl } from './Controls/RHFM_TextControl';
import { BarcodeTypes, BarcodeTypesColors } from '../../dal/enums/barcodeTypes';
import { LocationTypes, LocationTypesColors } from '../../dal/enums/locationTypes';
import { LocationKinds } from '../../dal/enums/locationKinds';
import { LocationLabelColors, LocationLabelColorsColors } from '../../dal/enums/locationLabelColors';
import { TextFieldElement } from 'react-hook-form-mui';
import { Barcode } from '../../dto/collections/Barcode';
import { RHFM_TaxonSelect } from './Controls/RHFM_TaxonSelect';
import React from 'react';
import { IntCell } from './IntCell';
import { intMeta } from './intMeta';
import { dataStructureMeta } from './dataStructureMeta';
import { percentageMeta } from './percentageMeta';
import { barcodeMeta } from './barcodeMeta';
import { lookupMeta } from './lookupMeta';
import { stringMeta } from './stringMeta';
import { enumMeta } from './enumMeta';
import { dbListMeta } from './dbListMeta';
import { dateMeta } from './dateMeta';
import { boolMeta } from './boolMeta';
const {
    taxonomy: productTaxonomyHelper,
    category: categoryHelper,
    subCategory,
    subSubCategory,
    classifierHelper,
    mercariBrandHelper,
    brandHelper,
    hashTagHelper,
    hashTagUsageHelper,
    locationSegmentHelper,
    barcodeHelper,
    productLineHelper,
    productImageHelper
} = helpers;

const objectIdMeta = {
    id: '_id',
    header: 'OID',
    Cell: MRT_OIDCell,
    enableEditing: false,
    enableColumnActions: false,
    enableColumnDragging: false,
    maxSize: 100,
    muiTableBodyCellProps: { style: { justifyContent: 'center' } },
    meta: {
        valueIn: (x?: OID | null) => (x == null || (typeof x === 'string' && x.length === 0) ? null : fromOID(x)) ?? '',
        valueOut: (x?: string) => (x == null || x.length === 0 ? null : toOID(x) ?? null),
        defaultValue: () => Promise.resolve(new BSON.ObjectId())
    },
    Edit: RHFM_TextControl('_id', 'OID', undefined, undefined, undefined, true, true)
};
const $productTaxonomy = {
    getColumns: (...pre: string[]) =>
        [
            productTaxonomyHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name' })
            }),
            productTaxonomyHelper.accessor('kingdom', {
                header: 'Kingdom',
                Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
            }),
            productTaxonomyHelper.accessor('phylum', {
                header: 'Phlyum',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('klass', {
                header: 'Class',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('order', {
                header: 'Order',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('family', {
                header: 'Family',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('genus', {
                header: 'Genus',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('species', {
                header: 'Species',
                Edit: RHFM_TaxonSelect as any
            }),
            productTaxonomyHelper.accessor('lock', {
                ...boolMeta({ propertyName: 'lock', header: 'Is Locked' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IProductTaxonomy>[]
} as StaticTableDefinitions<IProductTaxonomy>;
export const collections: Record<string, StaticTableDefinitions<any>> = {
    string: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: '1',
                ...stringMeta({ propertyName: '1', header: 'Value', required: true, maxLength: 150 })
            }
        ]
    },
    hashTagUsage: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                hashTagUsageHelper.accessor('count', {
                    ...intMeta('count', { min: 0 })
                }),
                hashTagUsageHelper.accessor('from', {
                    ...dateMeta('from', { header: 'Timestamp' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<IHashTagUsage>,
    hashTag: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                hashTagHelper.accessor('_id', objectIdMeta),
                hashTagHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
                }),
                hashTagHelper.accessor('$maxCount', {
                    header: 'Highest Usage',
                    enableEditing: false,
                    Cell: IntCell
                }),
                hashTagHelper.accessor('$mostRecentDate', {
                    header: 'Most Recent',
                    enableEditing: false,
                    Cell: DateCell
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<IHashTag>,
    brand: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                brandHelper.accessor('_id', objectIdMeta),
                brandHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
                }),
                brandHelper.accessor('folder', {
                    ...stringMeta({ propertyName: 'folder', header: 'Folder' })
                }),
                brandHelper.accessor('mercariBrand', {
                    ...lookupMeta<IMercariBrand, IBrand>('mercariBrand', 'mercariBrand', 'name', { header: 'Mercari Brand' })
                }),
                brandHelper.accessor('website', {
                    ...stringMeta({ propertyName: 'website', header: 'URL', type: 'url' })
                }),
                brandHelper.accessor('parent', {
                    ...lookupMeta<IBrand, IBrand>('parent', 'brand', 'name', { header: 'Parent' })
                }),
                brandHelper.accessor('hashTags', {
                    ...dataStructureMeta<IBrand, IHashTag, 'hashTags'>('hashTags', 'name', 'brand', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<IBrand>,
    barcode: {
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
    } as StaticTableDefinitions<IBarcode>,
    locationSegment: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                locationSegmentHelper.accessor('_id', objectIdMeta),
                locationSegmentHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 50 })
                }),
                locationSegmentHelper.accessor('barcode', {
                    ...barcodeMeta('barcode', { header: '' }),
                    enableEditing: false,
                    enableClickToCopy: true,
                    sortingFn: 'sortBarcode'
                }) as any,
                locationSegmentHelper.accessor('barcode.valid', {
                    ...boolMeta({ propertyName: 'valid', header: 'Valid', readOnly: true }),
                    enableEditing: false,
                    Edit: undefined
                }),
                locationSegmentHelper.accessor('upcs', {
                    ...dbListMeta<Entity<IBarcode>>('upcs', 'barcode', {
                        header: 'UPCS',
                        convertPayload: (values: { rawValue: string }) => Barcode.ctor(values.rawValue) as Entity<IBarcode>,
                        init: () => Promise.resolve({ rawValue: '' } as any),
                        ItemComponent: ({ payload }: { payload: IBarcode }) => [payload.rawValue, payload.type].join('/'),
                        editControls: ({ context }) => (
                            <TextFieldElement
                                name='rawValue'
                                control={context.control}
                                label='Raw Value'
                                inputProps={{
                                    maxLength: 13,
                                    required: true
                                }}
                            />
                        )
                    })
                }),
                locationSegmentHelper.accessor('notes', {
                    ...stringMeta({ propertyName: 'notes', header: 'Notes', maxLength: 200 })
                }),
                locationSegmentHelper.accessor('type', {
                    ...enumMeta('type', LocationTypes, { colorMap: LocationTypesColors, header: 'Location Type' })
                }),
                locationSegmentHelper.accessor('kind', {
                    ...enumMeta('kind', LocationKinds, { header: 'Location Kind' })
                }),
                locationSegmentHelper.accessor('color', {
                    ...enumMeta('color', LocationLabelColors, { colorMap: LocationLabelColorsColors, header: 'Label Color' })
                })

                // upcs, barcode (get), name, type keyof type LocationTypesObj, color LocationLabelColorsKey, notes Opt<String>, kind LocationKindsKey
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<ILocationSegment>,
    mercariBrand: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                mercariBrandHelper.accessor('_id', objectIdMeta),
                mercariBrandHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
                }),
                mercariBrandHelper.accessor('hashTags', {
                    ...dataStructureMeta<IMercariBrand, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariBrand', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<IMercariBrand>,
    classifier: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                classifierHelper.accessor('_id', objectIdMeta),
                classifierHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 50 })
                }),
                classifierHelper.accessor('isAthletic', {
                    ...boolMeta({ propertyName: 'isAthletic', header: 'Is Athletic', defaultValue: false })
                }),
                classifierHelper.accessor('mercariSubSubCategory', {
                    ...lookupMeta<IMercariSubSubCategory, IClassifier>('mercariSubSubCategory', 'mercariSubSubCategory', 'fullname', { header: 'Full Name' })
                }),
                classifierHelper.accessor('shortname', {
                    ...stringMeta({ propertyName: 'shortname', header: 'Short Name', maxLength: 30 })
                }),
                classifierHelper.accessor('hashTags', {
                    ...dataStructureMeta<IClassifier, IHashTag, 'hashTags'>('hashTags', 'name', 'classifier', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
                }),
                classifierHelper.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                }),
                ...($productTaxonomy.getColumns('taxon') as DefinedMRTColumns<IClassifier>)
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<IClassifier>,
    productTaxonomy: $productTaxonomy,
    mercariCategory: {
        getColumns: (...pre: string[]) =>
            [
                categoryHelper.accessor('_id', objectIdMeta),
                categoryHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', maxLength: 50, required: true, header: 'Name' })
                }),
                categoryHelper.accessor('id', {
                    ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
                }),
                categoryHelper.accessor('hashTags', {
                    ...dataStructureMeta<IMercariCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariCategory', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
                }),
                categoryHelper.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                }),
                ...($productTaxonomy.getColumns('taxon') as DefinedMRTColumns<IMercariCategory>)
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IMercariCategory>[]
    } as StaticTableDefinitions<IMercariCategory>,
    mercariSubCategory: {
        getColumns: (...pre: string[]) =>
            [
                subCategory.accessor('_id', objectIdMeta),
                // subCategory.accessor('taxon.name', {
                //     enableEditing: false,
                //     id: 'taxon.name',
                //     header: 'Taxonomy'
                // }),
                subCategory.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', maxLength: 50, required: true })
                }),
                subCategory.accessor('id', {
                    ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
                }),
                subCategory.accessor('parent', {
                    ...lookupMeta<IMercariCategory, IMercariSubCategory>('parent', 'mercariCategory', 'name', { header: 'Parent' })
                }),
                subCategory.accessor('hashTags', {
                    ...dataStructureMeta<IMercariSubCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariSubCategory', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
                }),
                subCategory.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                }),
                ...($productTaxonomy.getColumns('taxon') as DefinedMRTColumns<IMercariSubCategory>)
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined }))
    } as StaticTableDefinitions<IMercariSubCategory>,
    mercariSubSubCategory: {
        getColumns: (...pre: string[]): MRT_ColumnDef<IMercariSubSubCategory, any>[] =>
            [
                subSubCategory.accessor('_id', objectIdMeta),
                subSubCategory.accessor('name', {
                    ...stringMeta({ propertyName: 'name', maxLength: 50, required: true, header: 'Name' })
                }),
                subSubCategory.accessor('fullname', {
                    ...stringMeta({ propertyName: 'fullname', header: 'Full Name' })
                }),
                subSubCategory.accessor('id', {
                    ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
                }),
                subSubCategory.accessor('parent', {
                    ...lookupMeta<IMercariSubCategory, IMercariSubSubCategory>('parent', 'mercariSubCategory', 'name', { header: 'Parent' })
                }),
                subSubCategory.accessor('hashTags', {
                    ...dataStructureMeta<IMercariSubSubCategory, IHashTag, 'hashTags'>('hashTags', 'name', 'mercariSubSubCategory', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
                }),
                subSubCategory.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                }),
                ...($productTaxonomy.getColumns('taxon') as DefinedMRTColumns<IMercariSubSubCategory>)
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IMercariSubSubCategory, any>[]
    } as StaticTableDefinitions<IMercariSubSubCategory>,
    productLine: {
        getColumns: (...pre: string[]): MRT_ColumnDef<IProductLine, any>[] =>
            [
                productLineHelper.accessor('_id', objectIdMeta),
                productLineHelper.accessor('name', {
                    ...stringMeta({
                        propertyName: 'name',
                        header: 'Name',
                        required: true,
                        maxLength: 50
                    })
                }),
                productLineHelper.accessor('brand', {
                    ...lookupMeta<IBrand, IProductLine>('brand', 'brand', 'name', { header: 'Brand' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IProductLine, any>[]
    } as StaticTableDefinitions<IProductLine>,
    // branding: {
    //     getColumns: (...pre: string[]): DefinedMRTColumns =>
    //         [
    //             brandingHelper.accessor('_id', objectIdMeta),
    //             brandingHelper.accessor('brand', {
    //                 ...lookupMeta<IBrand, IBranding>('brand', 'brand', 'name', { header: 'Brand' })
    //             }),
    //             brandingHelper.accessor('productLine', {
    //                 ...lookupMeta<IProductLine, IBranding>('productLine', 'productLine', 'name', { header: 'Product Line' })
    //             }),
    //             brandingHelper.accessor('description', {
    //                 ...stringMeta({ propertyName: 'description', header: 'Description', maxLength: 100, required: true })
    //             }),
    //             brandingHelper.accessor('modelNo', {
    //                 ...stringMeta({ propertyName: 'modelNo', header: 'Model #', maxLength: 30 })
    //             }),
    //             brandingHelper.accessor('hashTags', {
    //                 ...dataStructureMeta<IBranding, IHashTag, 'hashTags'>('hashTags', 'name', 'branding', 'reference', 'hashTag', 'set', { header: 'Hash Tags' })
    //             })
    //         ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    // } as StaticTableDefinitions<IBranding>,
    productImage: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                productImageHelper.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
    } as StaticTableDefinitions<IProductImage>
};
