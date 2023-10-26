import { IHashTagUsage } from '.';
import { dateFromNow } from './dateFromNow';
import { $db } from './db';
import Realm from 'realm';

export class HashTagUsage extends Realm.Object<IHashTagUsage> implements IHashTagUsage {
    from: Date = dateFromNow();
    count = 0;

    static schema: Realm.ObjectSchema = {
        name: $db.hashTagUsage(),
        embedded: true,
        properties: {
            from: $db.date.req,
            count: $db.int.zero
        }
    };
    static ctor(count = 0): IHashTagUsage {
        return { count, from: dateFromNow() };
    }
}

