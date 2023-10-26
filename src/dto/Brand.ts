import { OptObj, $db } from './db';
import Realm, { BSON } from 'realm';
import { normalizeStringForFS } from '../common/fs/normalizeStringForFS';
import { AttributeObject, IBrand, IHashTag, IMercariBrand } from './types';
import { ObjectId } from 'mongodb';
import { addDefaultHash } from './addDefaultHash';
import { mergeAttrObj } from './mergeAttrObj';
import { findHashTag } from './findHashTag';
import { is } from './is';

const updateFunction = function (item: IBrand, realm: Realm) {
    item.folder = normalizeStringForFS('-')(item.name.toLowerCase());
    const hashTags = findHashTag(realm)(item.name);
    const toEntry = hashTags.filter((x) => !item.hashTags.has(x));
    if (toEntry.length > 0) {
        if (is.dbSet(item.hashTags)) {
            item.hashTags.add(toEntry[0]);
        } else {
            item.hashTags = [hashTags[0]] as any;
        }
    }
};
export class Brand extends Realm.Object<IBrand> implements IBrand {
    gather(this: IBrand): ReturnType<IMercariBrand['gather']> & { brandName: string; brandFolder: string; hashTags: IHashTag[]; mercariBrandName?: string } {
        const { hashTags: brandHashTags, ...brandRemain } = this.parent?.gather() ?? { hashTags: [] };
        const { hashTags: mercariBrandHashTags, ...mercariBrandRemain } = this.mercariBrand?.gather() ?? { hashTags: [] };
        const thisHashTags = Array.from(this.hashTags);
        const thisRemain = {
            brandFolder: this.folder,
            brandName: this.name
        };
        const result = { ...mercariBrandRemain, ...brandRemain, ...thisRemain, hashTags: [...(brandHashTags ?? []), ...(mercariBrandHashTags ?? []), ...(thisHashTags ?? [])] };
        return result;
    }
    name = '';
    mercariBrand: OptObj<IMercariBrand>;
    website: Optional<string>;
    folder = '';
    parent: OptObj<IBrand>;
    hashTags!: DBSet<IHashTag>;
    _id: ObjectId = new BSON.ObjectId();
    update: (this: IBrand, realm: Realm) => IBrand = addDefaultHash<IBrand>('name', updateFunction).bind(this);

    // gather(): AttributeObject {
    //     const el = {
    //         brandFolder: this.folder,
    //         brandName: this.name,
    //         hashTags: Array.from(this.hashTags.values())
    //     };
    //     return mergeAttrObj((this.parent?.gather() as AttributeObject & { hashTags: IHashTag[] }) ?? { hashTags: [] }, this.mercariBrand?.gather());
    // }

    // $update(realm: Realm): IBrand {
    //     const hashTags = findHashTag(realm)(this.name);
    //     const toEntry = hashTags.filter((x) => !this.hashTags.has(x));
    //     const func = () => {
    //         this.folder = normalizeStringForFS('-')(this.name.toLowerCase());
    //         if (toEntry.length > 0) {
    //             this.hashTags.add(toEntry[0]);
    //         }
    //     };
    //     checkTransaction(realm)(func);
    //     return this;
    // }

    static schema: Realm.ObjectSchema = {
        name: $db.brand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariBrand: $db.mercariBrand.opt,
            website: $db.string.opt,
            folder: $db.string.opt,
            hashTags: $db.hashTag.list,
            parent: $db.brand.opt
        }
    };
}

export function updateFolder(realm: Realm) {
    return function (brand: Realm.Object<IBrand> & IBrand) {
        const { name } = brand;
        const newFolder = normalizeStringForFS('-')(name);
        console.log(`newFolder: ${newFolder}`);
        realm.write(() => {
            brand.folder = newFolder;
        });
    };
}
