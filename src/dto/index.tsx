import { Brand } from './Brand';
import { Classifier } from './Classifier';
import { Draft } from './Draft';
import { Listing } from './Listing';
import { LocationSegment } from './LocationSegment';
import { MercariBrand } from './MercariBrand';
import { MercariCategory } from './MercariCategory';
import { MercariSubCategory } from './MercariSubCategory';
import { MercariSubSubCategory } from './MercariSubSubCategory';
import { Product } from './Product';
import { ProductImage } from './ProductImage';
import { Scan } from './Scan';
import { Sku } from './Sku';
import Realm from 'realm';

const $$schema: Realm.ObjectClass<any>[] = [
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
    LocationSegment
];

export default $$schema;
