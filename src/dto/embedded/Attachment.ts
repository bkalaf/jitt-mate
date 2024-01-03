import { BSON } from 'realm';
import { IAttachment, IBinaryFile, IProduct } from '../../dal/types';
import * as fs from 'graceful-fs';
import * as path from 'path';
import * as Config from './../../config.json';
import { checkForFolder } from '../../common/fs/checkForFolder';

const extToMimeType = {
    gif: 'image/gif',
    jpg: 'image/jpg',
    jpeg: 'image/jpg',
    svg: 'image/svg',
    png: 'image/png',
    pdf: 'application/pdf',
    csv: 'text/csv',
    xlsx: 'application/vnd.ms-excel',
    mp4: 'video/mp4'
}

export class Attachment extends Realm.Object<IAttachment> implements IAttachment {
    uploadedFrom = '';
    fullpath = '';
    file: Optional<IBinaryFile<'manual' | 'video' | 'doc'>>;
    product: OptionalEntity<IProduct>;
    _id: OID = new BSON.ObjectId();
    static async ctor(product: IProduct, type: 'manual' | 'video' | 'doc', uploadedFrom: string) {
        const mimeType = extToMimeType[path.extname(uploadedFrom).replaceAll('.', '') as keyof typeof extToMimeType];
        const file = {
            data: await new File([fs.readFileSync(uploadedFrom).buffer], uploadedFrom, { type: mimeType }).arrayBuffer(),
            type,
            mimeType
        } as IBinaryFile<any>;
        const brandFolder = product.effectiveBrandFolder;
        const productFolder = product.folder;
        const fullpath = [Config.productImages.imageRoot, brandFolder, productFolder, type.concat('s'), path.basename(uploadedFrom)].join('/');
        const result = window.$$store?.create('attachment', {
            uploadedFrom,
            fullPath: '',
            file,
            product,
            _id: new BSON.ObjectID()
        });
        checkForFolder(path.dirname(fullpath));
        await fs.promises.rename(uploadedFrom, fullpath);
        return result;        
    }
    update() {
        return this;
    }
}
