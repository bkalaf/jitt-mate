/* eslint-disable @typescript-eslint/no-explicit-any */
import { stringMeta } from './metas/stringMeta';
import { materialCompositionColumns } from '../../dto/getColumns/materialComposition';
import { addressColumns } from '../../dto/getColumns/address';
import { scanColumns } from '../../dto/getColumns/scan';
import { productTaxonomyColumns } from '../../dto/getColumns/productTaxonomy';
import { hashTagUsageColumns } from '../../dto/getColumns/hashTagUsage';
import { hashTagColumns } from '../../dto/getColumns/hashTag';
import { brandColumns } from '../../dto/getColumns/brand';
import { barcodeColumns } from '../../dto/getColumns/barcode';
import { locationSegmentColumns } from '../../dto/getColumns/locationSegment';
import { mercariBrandColumns } from '../../dto/getColumns/mercariBrand';
import { classifierColumns } from '../../dto/getColumns/classifier';
import { mercariCategoryColumns } from '../../dto/getColumns/mercariCategory';
import { mercariSubCategoryColumns } from '../../dto/getColumns/mercariSubCategory';
import { mercariSubSubCategoryColumns } from '../../dto/getColumns/mercariSubSubCategory';
import { productLineColumns } from '../../dto/getColumns/productLine';
import { apparelDetailsColumns } from '../../dto/getColumns/apparelDetails';
import { productImageColumns } from '../../dto/getColumns/productImage';
import { rnColumns } from '../../dto/getColumns/rn';
import { productColumns } from '../../dto/getColumns/product';
import { skuColumns } from '../../dto/getColumns/sku';
import { $metas } from './metas';
export const collections: Record<string, StaticTableDefinitions<any>> = {
    string: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: 'value',
                ...$metas.string({ propertyName: 'value', header: 'Value', required: true, maxLength: 150 })
            }
        ]
    },
    int: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: 'value',
                ...$metas.int('value', { header: 'Value' })
            }
        ]
    },
    float: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: 'value',
                ...$metas.float('value', { header: 'Value', required: true })
            }
        ]
    },
    objectId: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: 'value',
                ...stringMeta({ propertyName: 'value', header: 'Value', required: true })
            }
        ]
    },
    uuid: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: 'value',
                ...stringMeta({ propertyName: 'value', header: 'Value', required: true })
            }
        ]
    },
    date: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: 'value',
                ...$metas.date('value', { header: 'Value' })
            }
        ]
    },
    hashTagUsage: hashTagUsageColumns,
    hashTag: hashTagColumns,
    brand: brandColumns,
    barcode: barcodeColumns,
    locationSegment: locationSegmentColumns,
    mercariBrand: mercariBrandColumns,
    classifier: classifierColumns,
    address: addressColumns,
    scan: scanColumns,
    productTaxonomy: productTaxonomyColumns,
    materialComposition: materialCompositionColumns,
    mercariCategory: mercariCategoryColumns,
    mercariSubCategory: mercariSubCategoryColumns,
    mercariSubSubCategory: mercariSubSubCategoryColumns,
    productLine: productLineColumns,
    productImage: productImageColumns,
    apparelDetails: apparelDetailsColumns,
    rn: rnColumns,
    product: productColumns,
    sku: skuColumns
};
