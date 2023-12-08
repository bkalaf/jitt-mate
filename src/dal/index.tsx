import { Classifier } from '../dto/collections/Classifier';
import { CustomItemField } from './CustomItemField';
import { Draft } from './Draft';
import { HashTag } from '../dto/collections/HashTag';
import { HashTagUsage } from '../dto/embedded/HashTagUsage';
import { Listing } from './Listing';
import { LocationSegment } from '../dto/collections/LocationSegment';
import { MercariBrand } from '../dto/collections/MercariBrand';
import { MercariCategory } from '../dto/collections/MercariCategory';
import { MercariSubCategory } from '../dto/collections/MercariSubCategory';
import { MercariSubSubCategory } from '../dto/collections/MercariSubSubCategory';
import { ProductImage } from './ProductImage';
import { Scan } from '../dto/embedded/Scan';
import { Sku } from './Sku';
import * as Realm from 'realm';
import { Barcode } from '../dto/collections/Barcode';
import { Address } from '../dto/embedded/Address';
import { Rn } from '../dto/collections/Rn';
import { ProductTaxonomy } from '../dto/embedded/ProductTaxonomy';
import { Brand } from '../dto/collections/Brand';
import { ProductLine } from '../dto/collections/ProductLine';
import { ApparelDetails } from '../dto/embedded/ApparelDetails';
import { MaterialComposition } from '../dto/embedded/MaterialComposition';
import { Product } from '../dto/collections/Product';

const $$schema: Realm.ObjectClass<any>[] = [
    Address,
    ApparelDetails,
    Barcode,
    Brand,
    Classifier,
    CustomItemField,
    Draft,
    HashTag,
    HashTagUsage,
    Listing,
    LocationSegment,
    MaterialComposition,
    MercariBrand,
    MercariCategory,
    MercariSubCategory,
    MercariSubSubCategory,
    Product,
    ProductImage,
    ProductLine,
    ProductTaxonomy,
    Rn,
    Scan,
    Sku,
];

export default $$schema;
