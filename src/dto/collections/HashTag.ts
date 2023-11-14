import Realm, { BSON } from 'realm';
import { checkTransaction } from '../../util/checkTransaction';
import { HashTagUsage } from '../embedded/HashTagUsage';
import { $db } from '../../dal/db';
import { IHashTag, IHashTagUsage } from '../../dal/types';
import { $$ } from '../../common/comparator/areRealmObjectsEqual';
import { daysDiffFromNow } from '../../common/date/daysDiffFromNow';
import { ColumnDef } from '@tanstack/react-table';
import { fromOID } from '../../dal/fromOID';
import { OIDTableCell } from '../../components/Table/Cells/OIDTableCell';
import { StringTableCell } from '../../components/Table/Cells/StringTableCell';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { updateImmediatelyAfterConstruction } from '../../decorators/class/updateImmediatelyAfterConstruction';
import { defineColumnsDecorator, staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { labelledByDecorator } from '../../decorators/class/labelledByDecorator';
import { defaultSortDecorator } from '../../decorators/class/defaultSortDecorator';
import { META } from '../../dal/types/META';
import { withAccessorFnDecorator, disableEdittingDecorator, asListDecorator, withObjectTypeDecorator, initializeEmptyArrayDecorator } from '../../decorators/field/baseMetaDecorator';
import { disableEditing } from '../../schema/decorators/disableEditing';
import { recalculateDecorator } from '../../decorators/method/recalculateDecorator';
import { defineCalculatedField } from '../../decorators/field/defineCalculatedField';
import { realmCollectionDecorator } from './realmCollectionDecorator';

@realmCollectionDecorator('name', 'name')
export class HashTag extends Realm.Object<IHashTag> implements IHashTag {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
    }
    
    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns { return [] }
    
    get $highestUsage(): Optional<IHashTagUsage> {
        return this.usage.length === 0 ? undefined : this.usage.length === 1 ? this.usage[0] : Array.from(this.usage).sort((x, y) => $$.number.sort(y.count, x.count))[0];
    }
    get $mostRecentUsage(): Optional<IHashTagUsage> {
        return this.usage.length === 0 ? undefined : this.usage.length === 1 ? this.usage[0] : Array.from(this.usage).sort((x, y) => $$.date.sort(y.from, x.from))[0];
    }
    get $maxCount(): number {
        return this.$highestUsage?.count ?? 0;
    }
    get $daysSinceMax(): Optional<number> {
        return this.$mostRecentDate == null ? undefined : Math.floor(daysDiffFromNow(this.$mostRecentDate));
    }
    get $mostRecentCount(): number {
        return this.$mostRecentUsage?.count ?? 0;
    }
    get $mostRecentDate(): Optional<Date> {
        return this.$mostRecentUsage?.from;
    }

    @wrapInTransactionDecorator()
    update(): Entity<IHashTag> {
        const $this = this as IHashTag;
        if ($this.usage.length <= 2) return this;
        const arr = Array.from($this.usage).map((x, ix) => [ix, x] as [number, IHashTagUsage]);
        const mostRecentIndex = arr.sort((x, y) => $$.date.sort(y[1].from, x[1].from))[0][0];
        const maxCountIndex = arr.sort((x, y) => $$.number.sort(y[1].count, x[1].count))[0][0];
        arr.map((x) => x[0])
            .filter((x) => x !== mostRecentIndex && x !== maxCountIndex)
            .reverse()
            .forEach((x) => $this.usage.remove(x));
        return this;
    }
    // const $this = this as IHashTag;
    // if ($this.usage.length <= 2) return this;
    // const arr = Array.from($this.usage).map((x, ix) => [ix, x] as [number, IHashTagUsage]);
    // const mostRecentIndex = arr.sort((x, y) => $$.date.sort(y[1].from, x[1].from))[0][0];
    // const maxCountIndex = arr.sort((x, y) => $$.number.sort(y[1].count, x[1].count))[0][0];
    // const func = () =>
    //     arr
    //         .map((x) => x[0])
    //         .filter((x) => x !== mostRecentIndex && x !== maxCountIndex)
    //         .reverse()
    //         .forEach((x) => $this.usage.remove(x));
    // checkTransaction(realm)(func);
    // return this;

    @wrapInTransactionDecorator()
    addUsage(count?: number | undefined): Entity<IHashTag> {
        this.usage.push(HashTagUsage.ctor(count ?? 0));
        // const func = () => {
        //     const nextUsage = HashTagUsage.ctor(count ?? 0);
        //     this.usage.push(nextUsage);
        // };
        // checkTransaction(realm)(func);
        // return this;
        return this;
    }
    @META.col.oid
    _id: BSON.ObjectId = new BSON.ObjectId();

    @META.col.name
    name = '';

    @asListDecorator('hashTagUsage')
    @withObjectTypeDecorator('hashTagUsage')
    @initializeEmptyArrayDecorator
    @withAccessorFnDecorator((x: IHashTag) => x.usage.length.toFixed(0))
    @disableEdittingDecorator
    // @defineCalculatedField((x: IHashTag) => {
    //     const maxCount = x.$highestUsage;
    //     const mostRecent = x.$mostRecentUsage;
    //     for (const [hashTagIndex, hashTagUsage] of Array.from(x.usage.values()).map((htu, ix) => [ix, htu] as [number, IHashTagUsage])) {
    //         if (maxCount !== hashTagUsage && mostRecent !== hashTagUsage) {
    //             x.usage.remove(hashTagIndex);
    //         }
    //     }
    //     return x.usage;
    // })
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

    @wrapInTransactionDecorator()
    static ctor(name: string, count = 0) {
        const realm = window.$$store!;
        const result: Realm.Object<IHashTag> & IHashTag = realm.create<IHashTag>($db.hashTag(), { _id: new BSON.ObjectId(), name, usage: [HashTagUsage.ctor(count)] });
       
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result!;
    }
    // get $highestUsage(): IHashTagUsage | undefined {
    //     if (this.usage == null || this.usage.length === 0) return undefined;
    //     return Array.from(this.usage).sort((a, b) => a.count < b.count ? -1 : a.count > b.count ? 1 : 0)[0];
    // };
    // get $mostRecentUsage(): IHashTagUsage | undefined {
    //     if (this.usage == null || this.usage.length === 0) return undefined;
    //     return Array.from(this.usage).sort((a, b) => a.from.valueOf() < b.from.valueOf() ? -1 : a.from.valueOf() > b.from.valueOf() ? 1 : 0)[0];
    // };
}
