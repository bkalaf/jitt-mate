import { $db, OptObj } from './db';
import Realm, { BSON } from 'realm';
import * as Config from './../config.json';
import * as path from 'path';
import * as fs from 'graceful-fs';
import { IProductImage, ISku } from './types';
import { checkForFolder } from '../common/fs/checkForFolder';
import { $$queryClient } from '../components/App';
import { boolDefaultUpdater } from '../dto/updaters/boolDefaultUpdater';
import { wrapInTransactionDecorator } from './transaction';

export class ProductImage extends Realm.Object<IProductImage> implements IProductImage {
    static async ctor(sku: ISku, f: File) {
        const buffer = await f.arrayBuffer();
        const ext = path.extname(f.name);
        const base = f.name.replaceAll(ext, '');
        const removeBG = [Config.downloadsPath, [base, Config.removeBgSuffix].join('')].join('/');   
        let buffer2: ArrayBuffer | undefined;
        let mimeType2: string | undefined;
        if (fs.existsSync(removeBG)) {
            const buff = fs.readFileSync(removeBG);
            const file2 = new File([buff], removeBG);
            buffer2 = await file2.arrayBuffer();
            mimeType2 = file2.type;
        }
        return {
            _id: new BSON.ObjectId(),
            sku,
            uploadedFrom: f.name,
            doNotRemoveBG: false,
            originalData: buffer,
            originalMimeType: f.type,
            removeBGData: buffer2,
            removeBGMimeType: mimeType2 ?? 'image/png'
        } as IProductImage
    }
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [$db.productImage()]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [$db.productImage()]
                        });
                    });
            })
        );
    }
    moveOriginal(): Promise<void> {
        checkForFolder(this.destinationPath);
        fs.renameSync(this.uploadedFrom, this.destinationOriginal);
        return Promise.resolve();
    }
    hasRemoveBGUpload(): boolean {
        return fs.existsSync(this.removeBGUploadPath);
    }
    moveRemoveBG(): Promise<void> {
        checkForFolder(this.destinationPath);
        fs.renameSync(this.removeBGUploadPath, this.destinationRemoveBG);
        return Promise.resolve();
    }
    hasRemoveBG(): boolean {
        return fs.existsSync(this.destinationRemoveBG);
    }
    get effectivePath(): string {
        return this.doNotRemoveBG ? this.destinationOriginal : this.hasRemoveBG() ? this.destinationRemoveBG : this.destinationOriginal;
    }
    @wrapInTransactionDecorator()
    update() {
        const bd = boolDefaultUpdater<IProductImage>;
        bd.bind(this)(['doNotRemoveBG' as const]);
        const buffer = fs.readFileSync(this.uploadedFrom);
        const file = new File([buffer], this.uploadedFrom);
        file.arrayBuffer().then((ab) => (this.originalData = ab));
        this.originalMimeType = file.type;
        if (this.hasRemoveBGUpload()) {
            const buffer2 = fs.readFileSync(this.removeBGUploadPath);
            const file2 = new File([buffer2], this.removeBGUploadPath);
            file2.arrayBuffer().then((ab2) => (this.removeBGData = ab2));
            this.removeBGMimeType = file2.type;
        }
        return this;
    }
    uploadedFrom = '';
    sku: OptionalEntity<ISku>;
    doNotRemoveBG = false;
    originalData: Optional<ArrayBuffer>;
    removeBGData: Optional<ArrayBuffer>;

    originalMimeType = '';
    removeBGMimeType = '';
    _id: BSON.ObjectId = new BSON.ObjectId();
    get filename(): string {
        return path.basename(this.uploadedFrom);
    }
    get removeBGFilename(): string {
        const ext = path.extname(this.uploadedFrom);
        const base = this.filename.replaceAll(ext, '');
        return [base, Config.removeBgSuffix].join('');
    }
    get removeBGUploadPath(): string {
        return [Config.downloadsPath, this.removeBGFilename].join('/');
    }
    get brandFolder(): string {
        return this.sku?.effectiveBrand?.folder ?? 'no-brand';
    }
    get productFolder(): string {
        return this.sku?.product?.folder.toHexString(true) ?? 'n/a';
    }
    get skuFolder(): string {
        return this.sku?.barcode?.scanValue ?? '0';
    }
    get destinationPath(): string {
        return [Config.productsRoot, this.brandFolder, this.productFolder, this.skuFolder].join('/');
    }
    get destinationOriginal(): string {
        return [this.destinationPath, this.filename].join('/');
    }
    get destinationRemoveBG(): string {
        return [this.destinationPath, this.removeBGFilename].join('/');
    }

    static schema: Realm.ObjectSchema = {
        name: $db.productImage(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            uploadedFrom: $db.string(),
            sku: $db.sku.opt,
            doNotRemoveBG: $db.bool.false,
            originalData: $db.data.opt,
            originalMimeType: $db.string.empty,
            removeBGData: $db.data.opt,
            removeBGMimeType: $db.string.empty 
        }
    };
}
// export class ProductImage extends Realm.Object<IProductImage> implements IProductImage {
//     update<T>(this: T, realm: Realm): T {
//         return this;
//     }
//     moveOriginal(index: number): Promise<void> {
//         return fs.promises.rename(this.$paths.originalSource(index), this.$paths.originalDestination);
//     }
//     moveRemoveBg(): Promise<void> {
//         if (fs.existsSync(this.$paths.removeBgSource)) {
//             return fs.promises.rename(this.$paths.removeBgSource, this.$paths.removeBgDestination);
//         }
//         return Promise.resolve()
//     }
//     checkDestinationFolder(): Promise<void> {
//         checkForFolder(path.dirname(this.$paths.originalDestination));
//         return Promise.resolve();
//     }
//     get $paths() {
//         return {
//             originalSource: (index: number) => [Config.imageImportRoot, index.toFixed(0), this.filename].join('/'),
//             removeBgSource: [Config.downloadsPath, this.$removeBgFilename].join('/'),
//             originalDestination: [Config.imageRoot, '', this.$sku, this.filename].join('/'),
//             removeBgDestination: [Config.imageRoot, '', this.$sku, this.$removeBgFilename].join('/')
//         };
//     }
//     get $sku(): ISku {
//         if (this.sku == null) throw new Error('no sku');
//         return this.sku;
//     }
//     get $barcode(): string {
//         return this.$sku.sku?.rawValue ?? ''
//     }
//     get $removeBgFilename(): string {
//         return path.basename(this.filename, path.extname(this.filename)).concat(Config.removeBgSuffix);
//     }
//     get $hasRemoveBg(): boolean {
//         const { removeBgDestination } = this.$paths;
//         return fs.existsSync(removeBgDestination);
//     }
//     get $effectivePath(): string {
//         return this.$hasRemoveBg ? this.$paths.removeBgDestination : this.$paths.originalDestination;
//     }

//     _id: BSON.ObjectId = new BSON.ObjectId();
//     filename = ' ';
//     sku: OptObj<ISku>;
//     static schema: Realm.ObjectSchema = {
//         name: $db.productImage(),
//         primaryKey: '_id',
//         properties: {
//             _id: $db.objectId,
//             filename: $db.string.empty,
//             sku: $db.sku.opt
//         }
//     };
//     get skuBarcode(): Optional<string> {
//         return this.sku?.sku?.rawValue;
//     }
//     get brandFolder(): string {
//         return this.sku?.product?.brand?.folder ?? 'no-brand';
//     }
//     get itemFolder(): Optional<string> {
//         return this.skuBarcode;
//     }
//     get fullpath(): Optional<string> {
//         const $brandFolder = this.brandFolder;
//         const $itemFolder = this.itemFolder;
//         if ($brandFolder == null || $itemFolder == null) return undefined;
//         return [Config.imageRoot, $brandFolder, $itemFolder].join('/');
//     }
//     get originalFullPath(): Optional<string> {
//         return this.fullpath != null ? [this.fullpath, this.filename].join('/') : undefined;
//     }
//     get removeBGFilename(): string {
//         const baseName = path.basename(this.filename, path.extname(this.filename));
//         return [baseName, Config.removeBgSuffix].join('');
//     }
//     get removeBGFullPath(): Optional<string> {
//         return this.fullpath != null ? [this.fullpath, this.removeBGFilename].join('/') : undefined;
//     }
//     get hasRemoveBG(): boolean {
//         if (this.removeBGFullPath == null) return false;
//         return fs.existsSync(this.removeBGFullPath);
//     }
//     get effectivePath(): Optional<string> {
//         if (this.hasRemoveBG) {
//             return this.removeBGFullPath;
//         }
//         return this.originalFullPath;
//     }
// }
