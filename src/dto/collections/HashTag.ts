import Realm, { BSON } from 'realm';
import { HashTagUsage } from '../embedded/HashTagUsage';
import { $db } from '../../dal/db';
import { IHashTag, IHashTagUsage } from '../../dal/types';
import { $$ } from '../../common/comparator/areRealmObjectsEqual';
import { daysDiffFromNow } from '../../common/date/daysDiffFromNow';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { $$queryClient } from '../../components/App';

@realmCollectionDecorator('name', 'name')
export class HashTag extends Realm.Object<IHashTag> implements IHashTag {
    @wrapInTransactionDecorator()
    static pruneList(list: DBSet<Entity<IHashTag>>) {
        for (const hash of list.values()) {
            hash.update();
        }
    }
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [HashTag.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [HashTag.schema.name]
                        });
                    });
            })
        );  
    }
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
        if (this.usage == null) this.usage = [] as any;
        if (this.usage.length <= 2) return this;
        const arr = Array.from(this.usage).map((x, ix) => [ix, x] as [number, IHashTagUsage]);
        const mostRecentIndex = arr.sort((x, y) => $$.date.sort(y[1].from, x[1].from))[0][0];
        const maxCountIndex = arr.sort((x, y) => $$.number.sort(y[1].count, x[1].count))[0][0];
        arr.map((x) => x[0])
            .filter((x) => x !== mostRecentIndex && x !== maxCountIndex)
            .reverse()
            .forEach((x) => this.usage.remove(x));
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

    @wrapInTransactionDecorator()
    static ctor(name: string, count = 0) {
        const realm = window.$$store!;
        const result: Realm.Object<IHashTag> & IHashTag = realm.create<IHashTag>($db.hashTag(), { _id: new BSON.ObjectId(), name, usage: [HashTagUsage.ctor(count)] });
       
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result!;
    }

}
