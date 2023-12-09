import { Classifier } from './Classifier';
import { CustomItemField } from '../../dal/CustomItemField';
import { Draft } from '../../dal/Draft';
import { HashTag } from './HashTag';
import { HashTagUsage } from '../embedded/HashTagUsage';
import { Listing } from '../../dal/Listing';
import { LocationSegment } from './LocationSegment';
import { MercariBrand } from './MercariBrand';
import { MercariCategory } from './MercariCategory';
import { MercariSubCategory } from './MercariSubCategory';
import { MercariSubSubCategory } from './MercariSubSubCategory';
import { BinaryFile, ProductImage } from './ProductImage';
import { Scan } from '../embedded/Scan';
import { Sku } from '../../dal/Sku';
import * as Realm from 'realm';
import { Barcode } from './Barcode';
import { Address } from '../embedded/Address';
import { Rn } from './Rn';
import { ProductTaxonomy } from '../embedded/ProductTaxonomy';
import { Brand } from './Brand';
import { ProductLine } from './ProductLine';
import { ApparelDetails } from '../embedded/ApparelDetails';
import { MaterialComposition } from '../embedded/MaterialComposition';
import { Product } from './Product';

const $$schema: Realm.ObjectClass<any>[] = [
    Address,
    ApparelDetails,
    Barcode,
    BinaryFile,
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
