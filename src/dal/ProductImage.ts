import { $db, OptObj } from './db';
import Realm, { BSON } from 'realm';
import * as Config from './../config.json';
import * as path from 'path';
import * as fs from 'graceful-fs';
import { IProductImage, ISku } from './types';
import { checkForFolder } from '../common/fs/checkForFolder';

export class ProductImage extends Realm.Object<IProductImage> implements IProductImage {
    update<T>(this: T, realm: Realm): T {
        return this;
    }
    moveOriginal(index: number): Promise<void> {
        return fs.promises.rename(this.$paths.originalSource(index), this.$paths.originalDestination);
    }
    moveRemoveBg(): Promise<void> {
        if (fs.existsSync(this.$paths.removeBgSource)) {
            return fs.promises.rename(this.$paths.removeBgSource, this.$paths.removeBgDestination);
        }
        return Promise.resolve()
    }
    checkDestinationFolder(): Promise<void> {
        checkForFolder(path.dirname(this.$paths.originalDestination));
        return Promise.resolve();
    }
    get $paths() {
        return {
            originalSource: (index: number) => [Config.imageImportRoot, index.toFixed(0), this.filename].join('/'),
            removeBgSource: [Config.downloadsPath, this.$removeBgFilename].join('/'),
            originalDestination: [Config.imageRoot, '', this.$sku, this.filename].join('/'),
            removeBgDestination: [Config.imageRoot, '', this.$sku, this.$removeBgFilename].join('/')
        };
    }
    get $sku(): ISku {
        if (this.sku == null) throw new Error('no sku');
        return this.sku;
    }
    get $barcode(): string {
        return this.$sku.sku;
    }
    get $removeBgFilename(): string {
        return path.basename(this.filename, path.extname(this.filename)).concat(Config.removeBgSuffix);
    }
    get $hasRemoveBg(): boolean {
        const { removeBgDestination } = this.$paths;
        return fs.existsSync(removeBgDestination);
    }
    get $effectivePath(): string {
        return this.$hasRemoveBg ? this.$paths.removeBgDestination : this.$paths.originalDestination;
    }

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
    get skuBarcode(): Optional<string> {
        return this.sku?.sku;
    }
    get brandFolder(): string {
        return this.sku?.product?.brand?.folder ?? 'no-brand';
    }
    get itemFolder(): Optional<string> {
        return this.skuBarcode;
    }
    get fullpath(): Optional<string> {
        const $brandFolder = this.brandFolder;
        const $itemFolder = this.itemFolder;
        if ($brandFolder == null || $itemFolder == null) return undefined;
        return [Config.imageRoot, $brandFolder, $itemFolder].join('/');
    }
    get originalFullPath(): Optional<string> {
        return this.fullpath != null ? [this.fullpath, this.filename].join('/') : undefined;
    }
    get removeBGFilename(): string {
        const baseName = path.basename(this.filename, path.extname(this.filename));
        return [baseName, Config.removeBgSuffix].join('');
    }
    get removeBGFullPath(): Optional<string> {
        return this.fullpath != null ? [this.fullpath, this.removeBGFilename].join('/') : undefined;
    }
    get hasRemoveBG(): boolean {
        if (this.removeBGFullPath == null) return false;
        return fs.existsSync(this.removeBGFullPath);
    }
    get effectivePath(): Optional<string> {
        if (this.hasRemoveBG) {
            return this.removeBGFullPath;
        }
        return this.originalFullPath;
    }
}
