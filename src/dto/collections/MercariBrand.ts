// ///<reference path="./../../global.d.ts" />
(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariBrand } from '../../dal/types';
import { META } from '../../dal/types/META';
import { defineColumnsDecorator, staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { updateImmediatelyAfterConstruction } from '../../decorators/class/updateImmediatelyAfterConstruction';
import { labelledByDecorator } from '../../decorators/class/labelledByDecorator';
import { defaultSortDecorator } from '../../decorators/class/defaultSortDecorator';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { ColumnDef } from '@tanstack/react-table';
import { realmCollectionDecorator } from './realmCollectionDecorator';

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

    @META.col.oid
    _id: BSON.ObjectId = new BSON.ObjectId();

    @META.col.name
    name = '';

    @META.col.hashTags
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
