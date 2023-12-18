/* eslint-disable @typescript-eslint/no-explicit-any */
import { materialCompositionColumns } from '../../dto/getColumns/materialComposition';
import { addressColumns } from '../../dto/getColumns/address';
import { scanColumns } from '../../dto/getColumns/scan';
import { productTaxonomyColumns } from '../../dto/getColumns/productTaxonomy';
import { hashTagUsageColumns } from '../../dto/getColumns/hashTagUsage';
import { hashTagColumns } from '../../dto/getColumns/hashTag';
import { brandColumns } from '../../dto/getColumns/brand';
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
import { measurementsColumns } from '../../dto/getColumns/measurements';
export const collections: Record<string, StaticTableDefinitions<any>> = {
    string: {
        getColumns: (): DefinedMRTColumns => [
            $metas.string('value', { required: true, maxLength: 150 }, false)
        ]
    },
    int: {
        getColumns: (): DefinedMRTColumns => [
            $metas.int('value', { required: true }, false)
        ]
    },
    float: {
        getColumns: (): DefinedMRTColumns => [
            $metas.float('value', { precision: 4, required: true }, false)
        ]
    },
    objectId: {
        getColumns: (): DefinedMRTColumns => [
            $metas.oid
        ]
    },
    uuid: {
        getColumns: (): DefinedMRTColumns => [
            $metas.string('value', { required: true }, false)
        ]
    },
    date: {
        getColumns: (): DefinedMRTColumns => [
            $metas.date('value', {}, false)
        ]
    },
    hashTagUsage: hashTagUsageColumns,
    hashTag: hashTagColumns,
    brand: brandColumns,
    // barcode: barcodeColumns,
    locationSegment: locationSegmentColumns,
    mercariBrand: mercariBrandColumns,
    classifier: classifierColumns,
    address: addressColumns,
    scan: scanColumns,
    productTaxonomy: productTaxonomyColumns,
    measurements: measurementsColumns,
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
