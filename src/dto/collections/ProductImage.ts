import { $db } from '../../dal/db';
import Realm, { BSON, ObjectSchema } from 'realm';
import * as Config from '../../config.json';
import * as path from 'path';
import * as fs from 'graceful-fs';
import { IBinaryFile, IProductImage, ISku } from '../../dal/types';
import { checkForFolder } from '../../common/fs/checkForFolder';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { checkTransaction } from '../../util/checkTransaction';
import { $$queryClient } from '../../components/App';

export class BinaryFile<T extends 'original' | 'remove-bg'> extends Realm.Object<IBinaryFile<T>> implements IBinaryFile<T> {
    mimeType!: string;
    data!: ArrayBuffer;
    type!: T;
    update() {
        return this;
    }
    static schema: ObjectSchema = {
        name: $db.binaryFile(),
        embedded: true,
        properties: {
            mimeType: $db.string.req,
            data: $db.data.req,
            type: $db.string.req
        }
    };
    static async ctor<T extends 'original' | 'remove-bg'>(type: T, fullpath: string) {
        const extension = path.extname(fullpath);
        const buffer = await fs.promises.readFile(fullpath);
        const mimeType = extension.replace('.', 'image/');
        const file = new File([buffer], fullpath, { type: mimeType });
        const data = await file.arrayBuffer();
        return {
            mimeType,
            data,
            type: type
        } as IBinaryFile<T>;
    }
}
function getRemoveBGFilename(fullpath: string) {
    const filename = path.basename(fullpath).replace(path.extname(fullpath), Config.productImages.removeBGSuffix);
    return {
        uploadPath: Config.filesystem.downloadsFolder,
        filename
    };
}
function getDestinationPath(sku: OptionalEntity<ISku>) {
    const basePath = Config.productImages.imageRoot;
    if (sku == null) throw new Error('no sku');
    const brandFolder = sku.product?.productLine?.brand?.folder ?? sku.product?.brand?.folder ?? 'no-brand';
    const productFolder = sku.product?.folder.toHexString(true);
    const skuFolder = sku.barcode?.scanValue;
    if (productFolder == null || skuFolder == null) throw new Error(`missing product or sku folder: ${productFolder} sku: ${skuFolder}`);
    return {
        basePath,
        brandFolder,
        productFolder,
        skuFolder,
        destinationFolder: [basePath, brandFolder, productFolder, skuFolder].join('/'),
        toDestinationPath: (fn: string) => [basePath, brandFolder, productFolder, skuFolder, fn].join('/')
    };
}
export class ProductImage extends Realm.Object<IProductImage> implements IProductImage {
    original: OptionalEntity<IBinaryFile<'original'>>;
    removeBg: OptionalEntity<IBinaryFile<'remove-bg'>>;
    uploadedFrom!: string;
    sku: OptionalEntity<ISku>;
    doNotRemoveBG!: boolean;
    constructor(realm: Realm, args: any) {
        super(realm, args);
        const { toDestinationPath } = getDestinationPath(this.sku);
        const { filename: removeBGFileName, uploadPath: removeBGUploadPath } = getRemoveBGFilename(this.uploadedFrom);
        const removeBGOriginFullName = [removeBGUploadPath, removeBGFileName].join('/')
        const destinations = {
            original: toDestinationPath(path.basename(this.uploadedFrom)),
            removeBG: toDestinationPath(removeBGFileName)
        };
        checkForFolder(path.dirname(destinations.original));
        if (fs.existsSync(this.uploadedFrom)) {
            try {
                fs.renameSync(this.uploadedFrom, destinations.original);
            } catch (error1) {
                console.error(error1);
                console.error((error1 as Error).message);
                try {
                    fs.copyFileSync(this.uploadedFrom, destinations.original);
                    fs.rmSync(this.uploadedFrom);
                } catch (error2) {
                    console.error(error2);
                    console.error((error2 as Error).message);
                    throw new Error([(error1 as Error).message, (error2 as Error).message].join('\n'));
                }
            }
        } else {
            throw new Error(`file does not exist: ${this.uploadedFrom}`);
        }
        if (fs.existsSync(removeBGOriginFullName)) {
            try {
                fs.renameSync(removeBGOriginFullName, destinations.removeBG);
            } catch (error1) {
                console.error(error1);
                console.error((error1 as Error).message);
                try {
                    fs.copyFileSync(removeBGOriginFullName, destinations.removeBG);
                    fs.rmSync(removeBGOriginFullName);
                } catch (error2) {
                    console.error(error2);
                    console.error((error2 as Error).message);
                    throw new Error([(error1 as Error).message, (error2 as Error).message].join('\n'));
                }
            }
        } else {
            throw new Error(`file does not exist: ${removeBGOriginFullName}`);
        }
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

    @wrapInTransactionDecorator()
    static ctor(sku: Entity<ISku>, uploadedFrom: string) {
        if (window.$$store == null) throw new Error('no saved store');

        const { toDestinationPath } = getDestinationPath(sku);
        const { filename: removeBGFileName } = getRemoveBGFilename(uploadedFrom);
        const destinations = {
            original: toDestinationPath(path.basename(uploadedFrom)),
            removeBG: toDestinationPath(removeBGFileName)
        };
        checkForFolder(path.dirname(destinations.original));
        if (fs.existsSync(uploadedFrom)) {
            try {
                fs.renameSync(uploadedFrom, destinations.original);
            } catch (error1) {
                console.error(error1);
                console.error((error1 as Error).message);
                try {
                    fs.copyFileSync(uploadedFrom, destinations.original);
                    fs.rmSync(uploadedFrom);
                } catch (error2) {
                    console.error(error2);
                    console.error((error2 as Error).message);
                    throw new Error([(error1 as Error).message, (error2 as Error).message].join('\n'));
                }
            }
        } else {
            throw new Error(`file does not exist: ${uploadedFrom}`);
        }
        const result = {
            sku,
            uploadedFrom,
            doNotRemoveBG: false,
            _id: new BSON.ObjectId()
        } as any as IProductImage;
        return window.$$store.create<IProductImage>('productImage', result);
    }
    get destinations(): {
        original: string;
        removeBG: string;
    } {
        const { toDestinationPath } = getDestinationPath(this.sku);
        const { filename: removeBGFileName } = getRemoveBGFilename(this.uploadedFrom);
        return {
            original: toDestinationPath(path.basename(this.uploadedFrom)),
            removeBG: toDestinationPath(removeBGFileName)
        };
    }
    get hasRemoveBG(): boolean {
        const { removeBG } = this.destinations;
        return fs.existsSync(removeBG);
    }
    get effectivePath(): string {
        const { removeBG, original } = this.destinations;
        return this.hasRemoveBG ? removeBG : original;
    }
    async moveOriginal(destinationFolder: string, toDestinationPath: (s: string) => string) {
        const destination = toDestinationPath(path.basename(this.uploadedFrom));
        console.log(`move from ${this.uploadedFrom} ==> ${destination}`);
        try {
            checkForFolder(destinationFolder);
            await fs.promises.rename(this.uploadedFrom, destination);
        } catch (error) {
            await fs.promises.copyFile(this.uploadedFrom, destination);
            await fs.promises.rm(this.uploadedFrom);
        }
    }
    async moveRemoveBG(source: string, destinationFolder: string, removeBG: string, toDestinationPath: (s: string) => string) {
        const destination = toDestinationPath(removeBG);
        console.log(`move from ${source} ==> ${destination}`);
        try {
            checkForFolder(destinationFolder);
            await fs.promises.rename(source, destination);
        } catch (error) {
            await fs.promises.copyFile(source, destination);
            await fs.promises.rm(source);
        }
    }
    async createOriginal(db: Realm, fn: string) {
        if (this.original != null) return;
        if (!fs.existsSync(fn)) {
            console.warn(`file does not exist: ${fn}`);
            return;
        }
        console.info(`creating original: ${fn}`);
        const original = await BinaryFile.ctor('original', fn);
        checkTransaction(db)(() => (this.original = original as any));
    }
    async createRemoveBG(db: Realm, fn: string) {
        if (this.removeBg != null) return;
        if (!fs.existsSync(fn)) {
            console.warn(`file does not exist: ${fn}`);
            return;
        }
        console.info(`creating remove-bg: ${fn}`);
        const removeBg = await BinaryFile.ctor('remove-bg', fn);
        checkTransaction(db)(() => (this.removeBg = removeBg as any));
    }
    @wrapInTransactionDecorator()
    update() {
        // const { uploadPath, filename: removeBGFileName } = getRemoveBGFilename(this.uploadedFrom);
        // const { toDestinationPath, destinationFolder } = getDestinationPath(this.sku);
        // const { original: destinationOriginal, removeBG: destinationRemoveBg } = this.destinations;
        // if (this.doNotRemoveBG == null) this.doNotRemoveBG = false;
        // if (this.uploadedFrom == null) {
        //     this.uploadedFrom = '';
        //     return this;
        // }
        // this.createOriginal(destinationOriginal)
        //     .then(() => {
        //         return this.createRemoveBG(destinationRemoveBg).then(() => {
        //             return this;
        //         });
        //     })
        //     .catch(catchError);
        return this;
    }
    // async updateAsync(db: Realm) {
    //     const { original: destinationOriginal, removeBG: destinationRemoveBg } = this.destinations;
    //     // console.info(`original: ${destinationOriginal}, remove: ${destinationRemoveBg}`);
    //     // if (this.doNotRemoveBG == null) this.doNotRemoveBG = false;
    //     // if (this.uploadedFrom == null) {
    //     //     this.uploadedFrom = '';
    //     //     return this;
    //     // }
    //     await this.createOriginal(db, destinationOriginal);
    //     await this.createRemoveBG(db, destinationRemoveBg);
    //     return this;
    // }
    // static async ctor(sku: ISku, f: File) {
    //     const buffer = await f.arrayBuffer();
    //     const ext = path.extname(f.name);
    //     const base = f.name.replaceAll(ext, '');
    //     const removeBG = [Config.downloadsPath, [base, Config.removeBgSuffix].join('')].join('/');
    //     let buffer2: ArrayBuffer | undefined;
    //     let mimeType2: string | undefined;
    //     if (fs.existsSync(removeBG)) {
    //         const buff = fs.readFileSync(removeBG);
    //         const file2 = new File([buff], removeBG);
    //         buffer2 = await file2.arrayBuffer();
    //         mimeType2 = file2.type;
    //     }
    //     return {
    //         _id: new BSON.ObjectId(),
    //         sku,
    //         uploadedFrom: f.name,
    //         doNotRemoveBG: false,
    //         originalData: buffer,
    //         originalMimeType: f.type,
    //         removeBGData: buffer2,
    //         removeBGMimeType: mimeType2 ?? 'image/png'
    //     } as IProductImage
    // }
    // constructor(realm: Realm, args: any) {
    //     super(realm, args);
    //     // setImmediate(() =>
    //     //     Promise.resolve(this.update()).then(() => {
    //     //         $$queryClient
    //     //             .invalidateQueries({
    //     //                 queryKey: [$db.productImage()]
    //     //             })
    //     //             .then(() => {
    //     //                 $$queryClient.refetchQueries({
    //     //                     queryKey: [$db.productImage()]
    //     //                 });
    //     //             });
    //     //     })
    //     // );
    // }
    // moveOriginal(): Promise<void> {
    //     checkForFolder(this.destinationPath);
    //     fs.renameSync(this.uploadedFrom, this.destinationOriginal);
    //     return Promise.resolve();
    // }
    // hasRemoveBGUpload(): boolean {
    //     return fs.existsSync(this.removeBGUploadPath);
    // }
    // moveRemoveBG(): Promise<void> {
    //     checkForFolder(this.destinationPath);
    //     fs.renameSync(this.removeBGUploadPath, this.destinationRemoveBG);
    //     return Promise.resolve();
    // }
    // hasRemoveBG(): boolean {
    //     return fs.existsSync(this.destinationRemoveBG);
    // }
    // get effectivePath(): string {
    //     return this.doNotRemoveBG ? this.destinationOriginal : this.hasRemoveBG() ? this.destinationRemoveBG : this.destinationOriginal;
    // }
    // @wrapInTransactionDecorator()
    // update() {
    //     const bd = boolDefaultUpdater<IProductImage>;
    //     bd.bind(this)(['doNotRemoveBG' as const]);
    //     if (this.doNotRemoveBG == null) this.doNotRemoveBG = false;
    //     if (this.originalData == null) {
    //         const buffer = fs.readFileSync(this.uploadedFrom);
    //         const file = new File([buffer], this.uploadedFrom);
    //         file.arrayBuffer().then((ab) => (this.originalData = ab));
    //         this.originalMimeType = file.type;
    //         if (this.hasRemoveBGUpload()) {
    //             const buffer2 = fs.readFileSync(this.removeBGUploadPath);
    //             const file2 = new File([buffer2], this.removeBGUploadPath);
    //             file2.arrayBuffer().then((ab2) => (this.removeBGData = ab2));
    //             this.removeBGMimeType = file2.type;
    //         }
    //     }
    //     return this;
    // }

    _id: BSON.ObjectId = new BSON.ObjectId();
    get filename(): string {
        return path.basename(this.uploadedFrom);
    }
    get removeBGFilename(): string {
        const ext = path.extname(this.uploadedFrom);
        const base = this.filename.replaceAll(ext, '');
        return [base, Config.productImages.removeBGSuffix].join('');
    }
    get removeBGUploadPath(): string {
        return [Config.filesystem.downloadsFolder, this.removeBGFilename].join('/');
    }
    get brandFolder(): string {
        return this.sku?.isNoBrand ?? true ? 'no-brand' : this.sku?.effectiveBrand?.folder ?? 'no-brand';
    }
    get productFolder(): string {
        return this.sku?.product?.folder.toHexString(true) ?? 'n/a';
    }
    get skuFolder(): string {
        return this.sku?.barcode?.scanValue ?? '0';
    }
    get destinationPath(): string {
        return [Config.productImages.imageRoot, this.brandFolder, this.productFolder, this.skuFolder].join('/');
    }

    static schema: Realm.ObjectSchema = {
        name: $db.productImage(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            uploadedFrom: $db.string(),
            sku: $db.sku.opt,
            doNotRemoveBG: $db.bool.false,
            original: $db.binaryFile.opt,
            removeBg: $db.binaryFile.opt
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
