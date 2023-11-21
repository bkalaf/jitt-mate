/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ///<reference path="./../../global.d.ts" />
(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariBrand } from '../../dal/types';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';

@realmCollectionDecorator('name', 'name')
export class MercariBrand extends Realm.Object<IMercariBrand> implements IMercariBrand {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
    }
    get allHashTags(): Entity<IHashTag>[] {
        return Array.from(this.hashTags.values() ?? []);
    }

    @wrapInTransactionDecorator()
    update() {
        return this;
    }

    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    hashTags!: DBSet<Entity<IHashTag>>;

    static schema: Realm.ObjectSchema = {
        name: $db.mercariBrand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            hashTags: $db.hashTag.set
        }
    };

    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}
