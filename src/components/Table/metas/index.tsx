import { intMeta } from './intMeta';
import { boolMeta } from './boolMeta';
import { enumMeta } from './enumMeta';
import { flagsMeta } from './flagsMeta';
import { lookupMeta } from './lookupMeta';
import { stringMeta } from './stringMeta';
import { floatMeta } from './floatMeta';
import { percentageMeta } from './percentageMeta';
import { objectIdMeta } from './objectIdMeta';
import { dollarMeta } from './dollarMeta';
import { dictionaryMeta } from '../dictionaryMeta';
import { setMeta } from '../setMeta';
import { listMeta } from '../listMeta';
import { dateMeta } from './dateMeta';

export const $metas = {
    bool: boolMeta,
    // dbList: dbListMeta,
    enum: enumMeta,
    flags: flagsMeta,
    lookup: lookupMeta,
    string: stringMeta,
    int: intMeta,
    float: floatMeta,
    percent: percentageMeta,
    oid: objectIdMeta,
    dollar: dollarMeta,
    list: listMeta,
    dictionary: dictionaryMeta,
    set: setMeta,
    date: dateMeta
};