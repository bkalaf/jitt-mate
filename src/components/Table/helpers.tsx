import { createMRTColumnHelper } from 'material-react-table';
import { IDraft, IListing } from '../../dal/db';
import { IMercariCategory, IProductTaxonomy, IMercariSubCategory, IMercariSubSubCategory, ILocationSegment, IMercariBrand, IBrand, IBarcode, IAddress, IRn, IClassifier, IHashTag, IHashTagUsage, IScan, ICustomItemField, IProductImage, IProduct, ISku } from '../../dal/types';

/**
 * @copyright 2023-11-13
 */
const categoryHelper = createMRTColumnHelper<IMercariCategory>();
/**
 * @copyright 2023-11-13
 */
const productTaxonomyHelper = createMRTColumnHelper<IProductTaxonomy>();
const subCategoryHelper = createMRTColumnHelper<IMercariSubCategory>();
const subSubCategoryHelper = createMRTColumnHelper<IMercariSubSubCategory>();
const locationSegmentHelper = createMRTColumnHelper<ILocationSegment>();
const mercariBrandHelper = createMRTColumnHelper<IMercariBrand>();
const brandHelper = createMRTColumnHelper<IBrand>();
const barcodeHelper = createMRTColumnHelper<IBarcode>();
const addressHelper = createMRTColumnHelper<IAddress>();
const rnHelper = createMRTColumnHelper<IRn>();
const classifierHelper = createMRTColumnHelper<IClassifier>();
const hashTagHelper = createMRTColumnHelper<IHashTag>();
const hashTagUsageHelper = createMRTColumnHelper<IHashTagUsage>();
const scanHelper = createMRTColumnHelper<IScan>();
const customFieldHelper = createMRTColumnHelper<ICustomItemField>();
const productImageHelper = createMRTColumnHelper<IProductImage>();
const productHelper = createMRTColumnHelper<IProduct>();
const skuHelper = createMRTColumnHelper<ISku>();
const draftHelper = createMRTColumnHelper<IDraft>();
const listingHelper = createMRTColumnHelper<IListing>();
const webScrapeHelper = createMRTColumnHelper<any>();
const priceHelper = createMRTColumnHelper<any>();
const changeLogHelper = createMRTColumnHelper<any>();
const attachmentHelper = createMRTColumnHelper<any>();
const shipmentHelper = createMRTColumnHelper<any>();
const saleHelper = createMRTColumnHelper<any>();
const customerHelper = createMRTColumnHelper<any>();
const storageHelper = createMRTColumnHelper<any>();
const facilityHelper = createMRTColumnHelper<any>();
const auctionHelper = createMRTColumnHelper<any>();
const auctionPriceHelper = createMRTColumnHelper<any>();

export default {
    category: categoryHelper,
    taxonomy: productTaxonomyHelper,
    subCategory: subCategoryHelper,
    subSubCategory: subSubCategoryHelper,
    classifierHelper: classifierHelper,
    mercariBrandHelper,
    brandHelper,
    hashTagHelper,
    hashTagUsageHelper
};
