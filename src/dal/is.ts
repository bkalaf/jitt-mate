// ///<reference path="./../../global.d.ts" />
import { BSON } from 'realm';
import { both } from '../common/functions/both';
import { either } from '../common/either';
import { not } from '../common/not';
import { toInstanceOf } from '../common/toInstanceOf';
import { toTypeOf } from '../common/toTypeOf';
import { endsWith } from './endsWith';

const _is = {
    function: toTypeOf<AnyFunction>('function'),
    // eslint-disable-next-line @typescript-eslint/ban-types
    func: function <T extends Function>(x?: any): x is T {
        return toTypeOf<T>('function')(x);
    },
    array: (x?: any): x is AnyArray => x != null && Array.isArray(x),
    object: toTypeOf<AnyObject>('object'),
    string: toTypeOf<string>('string'),
    number: toTypeOf<number>('number'),
    bigint: toTypeOf<bigint>('bigint'),
    bool: toTypeOf<boolean>('boolean'),
    _undefined: toTypeOf<undefined>('undefined'),
    symbol: toTypeOf<symbol>('symbol'),
    dbList: toInstanceOf<Realm.Types.List<any>>(Realm.Types.List),
    dbDictionary: toInstanceOf<Realm.Types.Dictionary<any>>(Realm.Types.Dictionary),
    dbSet: toInstanceOf<Realm.Types.Set<any>>(Realm.Types.Set),
    dbLinkingObjects: toInstanceOf<Realm.Types.LinkingObjects<any, any>>(Realm.Types.LinkingObjects),
    promise: toInstanceOf<Promise<any>>(Promise),
    map: toInstanceOf<Map<any, any>>(Map),
    weakSet: toInstanceOf<WeakSet<any>>(WeakSet),
    weakDictionary: toInstanceOf<WeakMap<any, any>>(WeakMap),
    arrayBuffer: toInstanceOf<ArrayBuffer>(ArrayBuffer),
    objectId: toInstanceOf<BSON.ObjectId>(BSON.ObjectId),
    uuid: toInstanceOf<BSON.UUID>(BSON.UUID),
    date: toInstanceOf<Date>(Date),
    nullOrUndefined: (x?: any): x is undefined | null => x == null,
    notNull: (x?: any) => x != null,
    hasLength: (x?: any): x is { length: number } => toTypeOf<string>('string')(x) || (toTypeOf<AnyObject>('object')(x) && 'length' in x),
    zeroLength: (x: { length: number }): x is { length: 0 } => x.length === 0
};

const empty = both(both(_is.notNull)(_is.hasLength))(_is.zeroLength);
const $undefined = (x?: any): x is undefined => both(_is.nullOrUndefined)(_is._undefined)(x);
const $null = (x?: any): x is null => both(_is.nullOrUndefined)(not(_is._undefined))(x);
const $nil = either(_is.nullOrUndefined)(empty);
const tagIs =
    <T extends HTMLElement>(tagName: string) =>
    (el: Element): el is T =>
        el.tagName.toLowerCase() === tagName.toLowerCase();

export const $tagIs = {
    input: tagIs<HTMLInputElement>('input'),
    select: tagIs<HTMLSelectElement>('select'),
    textarea: tagIs<HTMLTextAreaElement>('textarea'),
    form: tagIs<HTMLFormElement>('form')
};
export const cleanup = (input: string) => ['?', '[', ']', '{', '}', '<', '>'].map((toReplace) => (s: string) => s.replaceAll(toReplace, '')).reduce((pv, cv) => cv(pv), input);

const isOneOf =
    (...listOfTypes: string[]) =>
    (str: string) =>
        listOfTypes.includes(cleanup(str));

export const is = {
    ..._is,
    null: $null,
    undefined: $undefined,
    empty,
    nil: $nil,
    not: {
        nil: not($nil),
        empty: not(empty)
    },
    tag: $tagIs,
    realmType: {
        optional: endsWith('?'),
        list: endsWith('[]'),
        set: endsWith('<>'),
        dictionary: endsWith('{}'),
        primitive: isOneOf('int', 'double', 'decimal128', 'float', 'bool', 'string', 'date', 'data', 'objectId', 'uuid', 'enum', 'linkingObjects'),
        string: isOneOf('string', 'enum')
    }
};
