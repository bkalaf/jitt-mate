import { dateFromNow } from '../../dal/dateFromNow';
import { $db } from '../../dal/db';
import Realm from 'realm';
import { IHashTagUsage } from '../../dal/types';
import { defineColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { $$date, $$dateInput, withInputElementDecorator, $$int, withImmutable, $$isRequired, $$numberInput, $$step, initializeTimestamp } from '../../decorators/field/baseMetaDecorator';

@defineColumnsDecorator
export class HashTagUsage extends Realm.Object<IHashTagUsage> implements IHashTagUsage {
    @$$date
    @withInputElementDecorator
    @$$dateInput
    @$$isRequired
    @initializeTimestamp
    from: Date = dateFromNow();
    @$$int
    @$$numberInput
    @$$step(1)
    @withImmutable
    @$$isRequired
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

