import { $db, IProductImage, ISku, Opt, OptObj } from './db';
import Realm, { BSON } from 'realm';
import * as Config from './../config.json';
import * as path from 'path';
import * as fs from 'graceful-fs';

export class ProductImage extends Realm.Object<IProductImage> implements IProductImage {
    _id: BSON.ObjectId = new BSON.ObjectId();
    filename = ' ';
    sku: OptObj<ISku>;
    static schema: Realm.ObjectSchema = {
        name: $db.productImage(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            filename: $db.string.empty,
            sku: $db.sku.opt
        }
    };
    nonNullSKU(): ISku {
        if (this.sku == null) throw new Error('no sku');
        return this.sku;
    }
    get skuBarcode(): Opt<string> {
        return this.sku?.sku;
    }
    get brandFolder(): string {
        return this.sku?.product?.brand?.folder ?? 'no-brand';
    }
    get itemFolder(): Opt<string> {
        return this.skuBarcode;
    }
    get fullpath(): Opt<string> {
        const $brandFolder = this.brandFolder;
        const $itemFolder = this.itemFolder;
        if ($brandFolder == null || $itemFolder == null) return undefined;
        return [Config.imageRoot, $brandFolder, $itemFolder].join('/')
    }
    get originalFullPath(): Opt<string> {
        return this.fullpath != null ? [this.fullpath, this.filename].join('/') : undefined;
    }
    get removeBGFilename(): string {
        const baseName = path.basename(this.filename, path.extname(this.filename));
        return [baseName, Config.removeBgSuffix].join('');
    }
    get removeBGFullPath(): Opt<string> {
        return this.fullpath != null ? [this.fullpath, this.removeBGFilename].join('/') : undefined;
    }
    get hasRemoveBG(): boolean {
        if (this.removeBGFullPath == null) return false;
        return fs.existsSync(this.removeBGFullPath);
    }
    get effectivePath(): Opt<string> {
        if (this.hasRemoveBG) {
            return this.removeBGFullPath;
        }
        return this.originalFullPath;
    }
}