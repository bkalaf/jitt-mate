import Realm, { Types, BSON } from 'realm';
import { getDescription } from './getDescription';
import { IDraft, IListing, OptObj, ISku, $db, IProduct, IClassifier, ConditionKeys, EnglishWeight, LWH, ShippingService, Opt, IProductImage } from './db';
import { checkTransaction } from '../util/checkTransaction';
import * as Config from './../config.json';
import * as fs from 'graceful-fs';
import { ColorKeys, importColors } from '../enums/importNecklineType';
import path from 'path';
import { checkForFolder } from '../common/fs/checkForFolder';

export const MAX_IMAGE_SIZE = 10485760;

export class Draft extends Realm.Object<IDraft> implements IDraft {
    recommendedPrice: Opt<number>;
    get getCategoryName(): string {
        const classifier = this.notNullClassifier;
        const category = classifier.getCategory();
        return category.name;
    }
    get getSubCategoryName(): string {
        const classifier = this.notNullClassifier;
        const subCategory = classifier.getSubCategory();
        return subCategory.name;
    }
    get getSubSubCategoryName(): string {
        const classifier = this.notNullClassifier;
        const subSubCategory = classifier.getSubSubCategory();
        return subSubCategory.name;
    }
    get getFullBrandFolder(): string {
        return [Config.imageRoot, this.isNoBrand ? 'no-brand' : this.getBrandFolder].join('/');
    };
    get getFullItemFolder(): string {
        return [this.getFullBrandFolder, this.itemFolder].join('/');
    };
    get getFullFinalFolder(): string {
        return [this.getFullItemFolder, 'ok'].join('/');
    };
    isReadyToPost = false;
    listingBackLink!: Types.LinkingObjects<IListing, 'draft'>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    sku: OptObj<ISku>;
    title = '';
    description = '';
    hashes: string[] = [];
    itemFolder = '';
    shippingPrice = 0;
    draftId: Opt<string>;
    isReady = false;
    static schema: Realm.ObjectSchema = {
        name: $db.draft(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            sku: $db.sku.opt,
            title: $db.string.empty,
            description: $db.string.empty,
            hashes: $db.string.list,
            itemFolder: $db.string.empty,
            shippingPrice: $db.float.zero,
            isReadyToPost: $db.bool.false,
            draftId: $db.string.opt,
            isReady: $db.bool.false,
            recommendedPrice: $db.float.opt
        }
    };
    static ctor(realm: Realm, sku: Realm.Object<ISku> & ISku, index: Opt<number>): Exclude<OptObj<IDraft>, undefined | null> {
        console.log('ctor');
        let result: OptObj<IDraft>;
        const SKU = realm.objects<ISku>('sku').filtered('sku == $0', sku.sku);
        if (SKU.length > 0) {
            console.log('SKU ALREADY ENTERED SKIPPING');
            return SKU[0].linkingObjects<IDraft>('draft', 'sku')[0];
        }
        const hashes = ([...(SKU[0].product?.brand?.hash?.split(', ') ?? []), SKU[0].product?.classifier?.mercariSubSubCategory?.hash, ...(SKU[0].product?.classifier?.hash ?? [])].filter(x => x != null) as string[]).slice(0, 3);
        realm.write(() => {
            const draft = realm.create<IDraft>('draft', { _id: new BSON.ObjectId(), sku, shippingPrice: 10, hashes, isReadyToPost: false, itemFolder: '', title: '', description: '' });
            console.log(`draft`, draft);
            result = draft.autofill(realm);
            if (index != null) {
                const importSource = [Config.imageImportRoot, index.toFixed(0)].join('/');
                const importDestination = result.getFullItemFolder;
                checkForFolder(importDestination);
                const files = fs.readdirSync(importSource);
                for (const filename of files) {
                    const fn = path.basename(filename);
                    const productImage = realm.create<IProductImage>('productImage', { _id: new BSON.ObjectId(), filename: fn, sku: draft.sku });
                    fs.renameSync([importSource, filename].join('/'), productImage.originalFullPath ?? filename);
                    const removeBgFn = productImage.removeBGFilename;
                    console.log(`moved: ${filename}`);
                    if (fs.existsSync([Config.downloadsPath, removeBgFn].join('/'))) {
                        if (productImage.removeBGFullPath == null) throw new Error(`cannot move: bad removeBgPath\n${JSON.stringify(productImage)}`);
                        fs.renameSync([Config.downloadsPath, removeBgFn].join('/'), productImage.removeBGFullPath);
                        console.log(`found: removeBG version`);
                        console.log(`moved: ${[Config.downloadsPath, removeBgFn].join('/')}`);
                    } else {
                        console.log(`remove bg missing for: ${fn}`);
                        fs.copyFileSync(productImage.originalFullPath ?? filename, [Config.missingRemoveBG, fn].join('/'));
                    }
                }
                console.log('images complete');
            }
        });
        return result!;
    }
    get getImages(): string[] {
        // const folder = this.getFullFinalFolder;
        // const files = fs.readdirSync(folder);
        // const okFiles = files.map(f => ({
        //     stats: fs.statSync([folder, f].join('/')),
        //     name: [folder, f].join('/')
        // })).filter(stats => stats.stats.size <= MAX_IMAGE_SIZE).map(stats => stats.name);
        // if (okFiles.length !== files.length) {
        //     console.log(`*** ${files.length - okFiles.length} files were omitted because they exceed the max size ***`);
        // }
        return this.sku?.productImages?.map(image => image.effectivePath ?? '') ?? [];
    }
    get isPostable(): boolean {
        return this.isReadyToPost && (this.draftId == null || this.draftId.length === 0);
    }
    get isListed(): boolean {
        return this.listingBackLink.length > 0;
    }
    get notNullSku(): ISku {
        if (this.sku == null) throw new Error('no sku');
        return this.sku;
    }
    get notNullProduct(): IProduct {
        const sku = this.notNullSku;
        if (sku.product == null) throw new Error('no product');
        return sku.product;
    }
    get notNullClassifier(): IClassifier {
        const product = this.notNullProduct;
        if (product.classifier == null) throw new Error('no classifier');
        return product.classifier;
    }
    get isNoBrand(): boolean {
        const product = this.notNullProduct;
        if (product.brand == null || product.brand.name === '-') {
            return true;
        }
        return false;
    };
    get getBrandName(): string | undefined {
        const product = this.notNullProduct;
        return product?.brand?.name;
    };
    get getMercariBrandName(): string | undefined {
        const product = this.notNullProduct;
        if (this.isNoBrand) return undefined;
        return product.brand?.mercariBrand?.name;
    };
    get getBrandFolder(): string | undefined {
        const product = this.notNullProduct;
        return product.brand?.folder?.replaceAll('/', '-');
    }
    get getCategoryId(): string {
        const classifier = this.notNullClassifier;
        const category = classifier.getCategory();
        return category.id;
    };
    get getSubCategoryId(): string {
        const classifier = this.notNullClassifier;
        const subCategory = classifier.getSubCategory();
        return subCategory.id;
    };
    get getSubSubCategoryId(): string {
        const classifier = this.notNullClassifier;
        const subSubCategory = classifier.getSubSubCategory();
        return subSubCategory.id;
    };
    get getCondition(): ConditionKeys {
        const sku = this.notNullSku;
        return sku.condition;
    };
    get getColor(): ColorKeys | undefined {
        const product = this.notNullProduct;
        return product.color;
    };
    get getMercariColor(): MercariColor | undefined {
        const color = this.getColor;
        const [colorKey, $color] = importColors(color);
        return color != null ? $color as MercariColor : undefined;
    }
    get getWeight(): number {
        const product = this.notNullProduct;
        const { weightG } = product;
        if (weightG == null) throw new Error('no weight');
        const weightLbs = weightG / 453.6;
        return weightLbs;
    };
    get getShipWeight(): EnglishWeight {
        const weight = this.getWeight * 1.3;
        const lbs = Math.floor(weight);
        const ozs = Math.ceil((weight - lbs) * 16);
        const lb = ozs === 16 ? lbs + 1 : lbs;
        const oz = ozs === 16 ? 0 : ozs;
        return { lb, oz };
    }
    get getDimensions(): LWH | undefined {
        const dims: Record<string, number> = {};
        const product = this.notNullProduct;
        const { lengthIn, widthIn, heightIn } = product;
        if (lengthIn == null && widthIn == null && heightIn == null) return undefined;
        if (lengthIn != null) dims.length = lengthIn;
        if (widthIn != null) dims.width = widthIn;
        if (heightIn != null) dims.height = heightIn;
        return dims;
    };
    get hasDimensions(): boolean {
        const dims = this.getDimensions;
        return dims == null;
    };
    get getShippingService(): ShippingService {
        const classifier = this.notNullClassifier;
        return classifier.mediaMail ? 'media-mail' : 'standard';
    };
    get getCarrier(): string {
        const sku = this.notNullSku;
        const [price, carrier, carrierId] = sku.carrier();
        return carrier;
    };
    get getCarrierId(): number {
        const sku = this.notNullSku;
        const [price, carrier, carrierId] = sku.carrier();
        return carrierId;
    };
    autofill(realm: Realm): Realm.Object<IDraft> & IDraft {
        if (this.sku == null) throw new Error('no sku');
        if (this.sku.product == null) throw new Error('no product');

        console.log('autofill');
        const { title, itemFolder, description } = getDescription(this.sku.product, this.sku);
        console.log(`title: ${title}`);
        console.log(`description: ${description}`);
        console.log(`itemFolder: ${itemFolder}`);
        const hashes = [
            ...(this.sku.product.brand?.hash?.split(', ') ?? []),
            ...this.sku.product.classifier?.mercariSubSubCategory?.hash != null ? [this.sku.product.classifier?.mercariSubSubCategory?.hash] : [],
            ...(this.sku.product.classifier?.hash ?? [])
        ].slice(0, 3);
        const func = () => {
            this.title = title;
            this.description = description;
            this.itemFolder = this.sku?.sku ?? '0';
            this.shippingPrice = this.notNullSku.carrier()[0];
            this.hashes = hashes;
        };
        checkTransaction(realm)(func);
        return this;
    }
    drafted(realm: Realm, draftId: string) {
        const func = () => {
            this.draftId = draftId;
        };
        checkTransaction(realm)(func);
        return this;
    }
}


