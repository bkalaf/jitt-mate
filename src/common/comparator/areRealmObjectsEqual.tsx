import { BSON } from 'realm';
import { comparableToEquatable } from './comparableToEquatable';
import { composeR } from '../functions/composeR';
import { createMonads } from './createMonads';

// export function areRealmObjectsEqual<T extends { _id: BSON.ObjectId }>(left: T) {
//     return function (right: T) {
//         return left._id.toHexString() === right._id.toHexString();
//     };
// }

export const createComparable = function <T, U>(extractor: (x: T) => U, comp: (x: U, y: U) => CompareResult = (x: any, y: any) => x < y ? -1 : x > y ? 1 : 0): IComparable<T> {
    return (left: T) =>
        (right: T): CompareResult =>
            comp(extractor(left), extractor(right))
};

const getHexString = (item: { toHexString(): string }) => item.toHexString();
const getTimestamp = (x: Date) => x.valueOf();

export function curr<T, U, V>(func: (x: T, y: U) => V) {
    return (args: [T, U]) => func(...args);
}
export const createEqualTo = function <T, U>(extractor: (x: T) => U, comp: (x: U, y: U) => CompareResult = (x: any, y: any) => (x < y ? -1 : x > y ? 1 : 0)) {
    return composeR(curr(createComparable))(comparableToEquatable<T>)([extractor, comp]);
};
export const isEqual = (result: CompareResult) => result === 0;

export const $$ = {
    objectId: createMonads<BSON.ObjectId, string>(getHexString),
    date: createMonads(getTimestamp),
    realmObject: createMonads<{ _id: BSON.ObjectId }, BSON.ObjectId>((x: { _id: BSON.ObjectId }) => x._id, (a, b) => getHexString(a).localeCompare(getHexString(b)) as CompareResult)
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
