import { Brand } from './TBrand';
import { Classifier } from './TClassifier';
import { CustomItemField } from './CustomItemField';
import { Draft } from './Draft';
import { HashTag } from './HashTag';
import { HashTagUsage } from './HashTagUsage';
import { Listing } from './Listing';
import { LocationSegment } from './TLocationSegment';
import { MercariBrand } from './TMercariBrand';
import { MercariCategory } from './TMercariCategory';
import { MercariSubCategory } from './TMercariSubCategory';
import { MercariSubSubCategory } from './TMercariSubSubCategory';
import { Product } from './TProduct';
import { ProductImage } from './ProductImage';
import { Scan } from './TScan';
import { Sku } from './Sku';
import * as Realm from 'realm';
import { Barcode } from './TBarcode';
import { Address } from './TAddress';
import { Rn } from './TRn';

const $$schema: Realm.ObjectClass<any>[] = [
    Address,
    Rn,
    MercariBrand,
    Brand,
    MercariCategory,
    MercariSubCategory,
    MercariSubSubCategory,
    Classifier,
    Product,
    Sku,
    Draft,
    Listing,
    ProductImage,
    Scan,
    LocationSegment,
    HashTagUsage,
    HashTag,
    CustomItemField,
    Barcode
];

export default $$schema;
