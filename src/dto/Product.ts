import { CollarTypeKeys, ColorKeys, CuffTypeKeys, NecklineTypeKeys, OriginKeys, SizeKeys, SleeveTypeKeys, TopAdornmentKeys } from '../enums/importNecklineType';
import { IProduct, OptObj, IBrand, IClassifier, Opt, MadeOf, $db } from './db';
import Realm, { BSON } from 'realm';


export class Product extends Realm.Object<IProduct> implements IProduct {
    circa: Opt<string>;
    topAdornment: Opt<TopAdornmentKeys>;
    collarType: Opt<CollarTypeKeys>;
    cuffType: Opt<CuffTypeKeys>;
    notes: Opt<string>;
    hasTags = false;
    isVintage = false;
    isRare = false;
    waistType: Opt<'drawstring' | 'stretch'>;
    backlineType: Opt<'v' | 'closed' | 'open' | 'u' | 'bare' | 'x' | 'bow' | 'strappy'>;
    title: Opt<string>;
    subtitle: Opt<string>;
    authors: string[] = [];
    publisher: Opt<string>;
    pages: Opt<number>;
    copyright: Opt<number>;
    edition: Opt<number>;
    bookType: Opt<'hb' | 'pb' | 'bb'>;
    rating: Opt<'M' | 'G' | 'T' | 'AO' | 'NR' | 'PG' | 'R' | 'X' | 'PG-13' | 'RP' | 'E' | 'E10+'>;
    runtimeMin: Opt<number>;
    starring: string[]= [];
    directedBy: string[] = []

    _id: BSON.ObjectId = new BSON.ObjectId();
    brand: OptObj<IBrand>;
    classifier: OptObj<IClassifier>;
    upcs: string[] = [];
    modelNo: Opt<string>;
    cutNo: Opt<string>;
    styleNo: Opt<string>;
    lengthIn: Opt<number>;
    size: Opt<SizeKeys>;
    color: Opt<ColorKeys>;
    origin: Opt<OriginKeys>;
    weightG: Opt<number>;
    widthIn: Opt<number>;
    heightIn: Opt<number>;
    neckIn: Opt<number>;
    chestIn: Opt<number>;
    inseamIn: Opt<number>;
    waistIn: Opt<number>;
    sleeveIn: Opt<number>;
    torsoIn: Opt<number>;
    descriptiveText: Opt<string>;
    rn: Opt<number>;
    pocketCount: Opt<number>;
    sleeveType: Opt<SleeveTypeKeys>;
    necklineType: Opt<NecklineTypeKeys>;
    madeOf: Opt<MadeOf> = {};
    features: string[] = [];
    
    static schema: Realm.ObjectSchema = {
        name: $db.product(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            brand: $db.brand.opt,
            classifier: $db.classifier.opt,
            upcs: $db.string.list,
            modelNo: $db.string.opt,
            styleNo: $db.string.opt,
            cutNo: $db.string.opt,
            lengthIn: $db.float.opt,
            widthIn: $db.float.opt,
            heightIn: $db.float.opt,
            weightG: $db.float.opt,
            neckIn: $db.float.opt,
            chestIn: $db.float.opt,
            sleeveIn: $db.float.opt,
            torsoIn: $db.float.opt,
            waistIn: $db.float.opt,
            inseamIn: $db.float.opt,
            descriptiveText: $db.string.opt,
            rn: $db.int.opt,
            pocketCount: $db.int.opt,
            size: $db.string.opt,
            color: $db.string.opt,
            origin: $db.string.opt,
            sleeveType: $db.string.opt,
            madeOf: $db.float.dictionary,
            features: $db.string.list,
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
            necklineType: $db.string.opt,
            backlineType: $db.string.opt,
            waistType: $db.string.opt,
            hasTags: $db.bool.true,
            isVintage: $db.bool.false,
            isRare: $db.bool.false,
            notes: $db.string.empty,
            collarType: $db.string.opt,
            cuffType: $db.string.opt,
            topAdornment: $db.string.opt,
            circa: $db.string.opt
        }
    };
}
