import Realm, { BSON } from 'realm';
import { checkTransaction } from '../util/checkTransaction';
import { HashTagUsage } from './HashTagUsage';
import { $db } from './db';
import { IHashTag, IHashTagUsage } from './types';

export class HashTag extends Realm.Object<IHashTag> implements IHashTag {
    addUsage(realm: Realm, count?: number | undefined): IHashTag {
        const func = () => {
            const nextUsage = HashTagUsage.ctor(count ?? 0);
            this.usage.push(nextUsage);
        };
        checkTransaction(realm)(func);
        return this;
    }

    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    usage: Realm.Types.List<IHashTagUsage> = [] as any;

    static schema: Realm.ObjectSchema = {
        name: $db.hashTag(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.req,
            usage: $db.hashTagUsage.list
        }
    };
    static ctor(realm: Realm, name: string, count = 0) {
        let result: Realm.Object<IHashTag> & IHashTag;
        const func = () => {
            result = realm.create<IHashTag>($db.hashTag(), { _id: new BSON.ObjectId(), name, usage: [HashTagUsage.ctor(count)] });
        };
        checkTransaction(realm)(func);
        return result!;
    }
    get $highestUsage(): IHashTagUsage | undefined {
        if (this.usage == null || this.usage.length === 0) return undefined;
        return Array.from(this.usage).sort((a, b) => a.count < b.count ? -1 : a.count > b.count ? 1 : 0)[0];
    };
    get $mostRecentUsage(): IHashTagUsage | undefined {
        if (this.usage == null || this.usage.length === 0) return undefined;
        return Array.from(this.usage).sort((a, b) => a.from.valueOf() < b.from.valueOf() ? -1 : a.from.valueOf() > b.from.valueOf() ? 1 : 0)[0];
    };

}
