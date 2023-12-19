/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ///<reference path="./../../global.d.ts" />
(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariBrand } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';
import { HashTag } from './HashTag';

export class MercariBrand extends Realm.Object<IMercariBrand> implements IMercariBrand {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [MercariBrand.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [MercariBrand.schema.name]
                        });
                    });
            })
        );
    }
    get allHashTags(): Entity<IHashTag>[] {
        return Array.from(this.hashTags.values() ?? []);
    }

    @wrapInTransactionDecorator()
    update() {
        if (this.hashTags == null) this.hashTags = [] as any;
        HashTag.pruneList(this.hashTags);
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
}
