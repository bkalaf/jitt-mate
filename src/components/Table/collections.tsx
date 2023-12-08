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

export const collections: Record<string, StaticTableDefinitions<any>> = {
    string: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: '1',
                ...stringMeta({ propertyName: '1', header: 'Value', required: true, maxLength: 150 })
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
    product: productColumns
};
