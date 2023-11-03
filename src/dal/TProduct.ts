import { $db } from './db';
import Realm, { BSON } from 'realm';
import { IBrand, IClassifier, IHashTag, IProduct } from './types';
import { ObjectId } from 'mongodb';

export class Product extends Realm.Object<IProduct> implements IProduct {
    _barcodes: string[] = [];
    brand: OptObj<IBrand>;
    circa: Optional<string>;
    classifier: OptObj<IClassifier>;
    color: Optional<'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'brown' | 'gold' | 'silver' | 'white' | 'black' | 'grey' | 'beige' | 'burgundy' | 'aqua' | 'cyan' | 'teal' | 'cream' | 'tan' | 'navy'>;
    cutNo: Optional<string>;
    descriptiveText: Optional<string>;
    features: string[] = [];
    hashTags: DBSet<IHashTag> = [] as any;
    heightIn: Optional<number>;
    isRare =  false;
    isVintage = false;
    madeOf: Partial<Record<'A' | 'C' | 'CS' | 'D' | 'E' | 'H' | 'K' | 'L' | 'M' | 'N' | 'OC' | 'P' | 'R' | 'U' | 'W' | 'X', number>> = {};
    modelNo: Optional<string>;
    notes: Optional<string>;
    styleNo: Optional<string>;
    upcs: string[] = []
    weightG: Optional<number>;
    widthIn: Optional<number>;
    _id: BSON.ObjectId = new BSON.ObjectId()
    update<T>(this: T, realm: Realm): T {
        return this;
    }
    chestIn: Optional<number>;
    neckIn: Optional<number>;
    inseamIn: Optional<number>;
    lengthIn: Optional<number>;
    sleeveIn: Optional<number>;
    torsoIn: Optional<number>;
    waistIn: Optional<number>;
    // circa: Optional<string>;
    // topAdornment: Optional<TopAdornmentKeys>;
    // collarType: Optional<CollarTypeKeys>;
    // cuffType: Optional<CuffTypeKeys>;
    // notes: Optional<string>;
    // hasTags = false;
    // isVintage = false;
    // isRare = false;
    // waistType: Optional<WaistTypeKeys>;
    // backlineType: Optional<BacklineTypeKeys>;
    // title: Optional<string>;
    // subtitle: Optional<string>;
    // authors: string[] = [];
    // publisher: Optional<string>;
    // pages: Optional<number>;
    // copyright: Optional<number>;
    // edition: Optional<number>;
    // bookType: Optional<BookTypeKeys>;
    // rating: Optional<GameRatingKeys | MovieRatingKeys>;
    // runtimeMin: Optional<number>;
    // starring: string[] = [];
    // directedBy: string[] = [];

    // _id: BSON.ObjectId = new BSON.ObjectId();
    // brand: OptObj<IBrand>;
    // classifier: OptObj<IClassifier>;
    // upcs: string[] = [];
    // modelNo: Optional<string>;
    // cutNo: Optional<string>;
    // styleNo: Optional<string>;
    // lengthIn: Optional<number>;
    // size: Optional<SizeKeys>;
    // color: Optional<ColorKeys>;
    // origin: Optional<OriginKeys>;
    // weightG: Optional<number>;
    // widthIn: Optional<number>;
    // heightIn: Optional<number>;
    // neckIn: Optional<number>;
    // chestIn: Optional<number>;
    // inseamIn: Optional<number>;
    // waistIn: Optional<number>;
    // sleeveIn: Optional<number>;
    // torsoIn: Optional<number>;
    // descriptiveText: Optional<string>;
    // rn: Optional<number>;
    // pocketCount: Optional<number>;
    // sleeveType: Optional<SleeveTypeKeys>;
    // necklineType: Optional<NecklineTypeKeys>;
    // madeOf: Optional<Partial<Record<MaterialKeys, number>>> = {};
    // features: string[] = [];
    // apparelType: Optional<ApparelTypeKeys>;
    // legType: Optional<LegTypeKeys>;
    // hashTags: DBSet<IHashTag>;

    static schema: Realm.ObjectSchema = {
        name: $db.product(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            brand: $db.brand.opt,
            classifier: $db.classifier.opt,
            _barcodes: $db.string.list,
            upcs: $db.string.list,
            modelNo: $db.string.opt,
            styleNo: $db.string.opt,
            cutNo: $db.string.opt,
            size: $db.string.opt,
            color: $db.string.opt,
            origin: $db.string.opt,
            weightG: $db.float.opt,
            lengthIn: $db.float.opt,
            widthIn: $db.float.opt,
            heightIn: $db.float.opt,
            neckIn: $db.float.opt,
            chestIn: $db.float.opt,
            sleeveIn: $db.float.opt,
            torsoIn: $db.float.opt,
            waistIn: $db.float.opt,
            inseamIn: $db.float.opt,

            descriptiveText: $db.string.opt,
            rn: $db.int.opt,
            pocketCount: $db.int.opt,            
            sleeveType: $db.string.opt,
            necklineType: $db.string.opt,
            backlineType: $db.string.opt,
            waistType: $db.string.opt,
            collarType: $db.string.opt,
            topAdornment: $db.string.opt,
            apparelType: $db.string.opt,
            madeOf: $db.float.dictionary,
            legType: $db.string.opt,
            cuffType: $db.string.opt,

            hashTags: $db.hashTag.set,
            features: $db.string.list,
            circa: $db.string.opt,

            title: $db.string.opt,
            subtitle: $db.string.opt,
            authors: $db.string.list,
            publisher: $db.string.opt,
            pages: $db.int.opt,
            copyright: $db.int.opt,
            edition: $db.int.opt,
            bookType: $db.string.opt,

            rating: $db.string.opt,
            runtimeMin: $db.int.opt,
            starring: $db.string.list,
            directedBy: $db.string.list,

            hasTags: { type: 'bool', optional: true, default: true },
            isVintage: { type: 'bool', optional: true, default: false },
            isRare: { type: 'bool', optional: true, default: false },
            notes: { type: 'string', optional: true, default: '' },
        }
    };

    // get $apparelGroup(): Optional<ApparelGroupKeys>{
    //     return this.classifier?.$apparelGroup;
    // }
    // get $gender(): Optional<GenderKeys>{
    //     return this.classifier?.$gender;
    // }
    // get $itemGroup(): Optional<ItemGroupKeys>{
    //     return this.classifier?.$itemGroup;
    // }
    // get $sizeMap(): (value?: SizeKeys) => ISizeEntry | undefined{
    //     return this.classifier.$sizeMap ?? ((_x?: any) => undefined)
    // }
    // get $sizingType(): Optional<SizingTypeKeys>{
    //     return this.classifier.$sizingType;
    // }
    // get $sleeveType(): Optional<SleeveTypeKeys>{
    //     return this.sleeveType ?? this.classifier?.$sleeveType;
    // }
    // get $necklineType(): Optional<NecklineTypeKeys>{
    //     return this.necklineType;
    // }
    // get $backlineType(): Optional<BacklineTypeKeys>{
    //     return this.backlineType;
    // }
    // get $waistType(): Optional<WaistTypeKeys>{
    //     return this.waistType;
    // }
    // get $collarType(): Optional<CollarTypeKeys>{
    //     return this.collarType;
    // }
    // get $topAdornment(): Optional<TopAdornmentKeys>{
    //     return this.$topAdornment ?? this.classifier?.$topAdornment;
    // }
    // get $apparelType(): Optional<ApparelTypeKeys>{
    //     return this.apparelType ?? this.classifier?.$apparelType;
    // }
    // get $legType(): Optional<LegTypeKeys>{
    //     return this.legType ?? this.classifier?.$legType;
    // }
    // get $isMediaMail(): boolean{
    //     return this.classifier?.isMediaMail ?? false;
    // }
    // get $categoryId(): string{
    //     return $css.id(this.classifier?.$categoryId);
    // }
    // get $subCategoryId(): string{
    //     return $css.id(this.classifier?.$subCategoryId);
    // }
    // get $subSubCategoryId(): string{
    //     return $css.id(this.classifier?.$subSubCategoryId);
    // }
    // get $hashTags(): IHashTag[]{
    //     const classifierHash = this.classifier?.$hashTags;
    //     const brandHash = this.brand?.$hashTags;
    //     const thisHash = Array.from(this.hashTags.values());
    //     return $$.realmObject.distinct([...classifierHash, ...brandHash, ...thisHash]) as IHashTag[];
    // }
    // get $cuffType(): Optional<CuffTypeKeys>{
    //     return this.cuffType;
    // }
    // get $brandFolder(): string {
    //     return this.brand?.folder ?? 'no-brand';
    // }
    // get $brandName(): Optional<string> {
    //     return this.brand?.$brandName;
    // }
    // get $isNoBrand(): boolean {
    //     return this.$brandName == null;
    // }
}
