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
import { Product } from './TProduct';
import { ProductImage } from './ProductImage';
import { Scan } from './TScan';
import { Sku } from './Sku';
import * as Realm from 'realm';
import { Barcode } from '../dto/collections/Barcode';
import { Address } from './TAddress';
import { Rn } from './TRn';
import { ProductTaxonomy } from '../dto/collections/ProductTaxonomy';
import { Brand } from '../dto/collections/Brand';

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
    Barcode,
    ProductTaxonomy
];

export default $$schema;
