// ///<reference path="./../../global.d.ts" />
import { BSON } from 'realm';
import { createMonads } from './createMonads';
import { distinctBy } from '../array/distinctBy';
import { createEqualTo } from './createEqualTo';


const getHexString = (item: { toHexString(): string }) => item.toHexString();
const getTimestamp = (x: Date) => x.valueOf();

export const $$ = {
    objectId: createMonads<BSON.ObjectId, string>(getHexString),
    date: createMonads(getTimestamp),
    string: createMonads((x: string) => x),
    number: createMonads((x: number) => x),
    realmObject: createMonads<{ _id: BSON.ObjectId }, BSON.ObjectId>((x: { _id: BSON.ObjectId }) => x._id, (a, b) => getHexString(a).localeCompare(getHexString(b)) as CompareResult),
    object: {
        distinct: <T extends AnyObject, TKey extends keyof T>(key: TKey) => distinctBy<T[TKey]>(createEqualTo((obj: T) => obj[key]))
    }
};
// const oid1 = new BSON.ObjectId();
// const oid2 = new BSON.ObjectId();
// const oid3 = new BSON.ObjectId(oid1.toHexString());

// console.log(oid1.toHexString());
// console.log(oid2.toHexString());
// console.log(oid3.toHexString());

// console.log($$.realmObject.compareTo({ _id: oid1 })({ _id: oid2 }))
// console.log($$.realmObject.compareTo({ _id: oid1 })({ _id: oid1 }));
// console.log($$.realmObject.compareTo({ _id: oid2 })({ _id: oid1 }));
// console.log($$.realmObject.equalTo({ _id: oid1 })({ _id: oid1 }));
// console.log($$.realmObject.equalTo({ _id: oid1 })({ _id: oid3 }));
// console.log($$.realmObject.equalTo({ _id: oid1 })({ _id: oid2 }));

// const d1 = new Date('06-07-1979');
// const d2 = new Date('06-07-1979');
// const d3 = dateFromNow();

// console.log($$.date.equalTo(d1)(d2))
// console.log($$.date.equalTo(d1)(d3));
// console.log($$.date.compareTo(d1)(d2))
// console.log($$.date.compareTo(d3)(d2));


// console.log($$.number.compareTo(1)(-1))
// console.log($$.number.compareTo(1)(1));
// console.log($$.number.equalTo(1)(1));
// console.log($$.number.compareTo(0)(1));
// console.log($$.number.equalTo(1)(0));
// console.log($$.number.sort(0, 1));
// console.log($$.number.sort(1, -1));

