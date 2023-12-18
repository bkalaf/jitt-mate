import { intDefinition } from './$intDefinition';
import { boolDefinition } from './$boolDefinition';
import { enumDefinition } from './$enumDefinition';
import { flagsDefinition } from './$flagsDefinition';
import { lookupDefinition } from './$lookupDefinition';
import { floatDefinition } from './$floatDefinition';
import { percentageDefinition } from './$percentageDefinition';
import { objectIdMeta } from './objectIdMeta';
import { dollarDefinition } from './$dollarDefinition';
import { dictionaryDefinition } from './$dictionaryDefinition';
import { setDefinition } from './$setMeta';
import { listDefinition } from './$listDefinition';
import { dateDefinition } from './$dateDefinition';
import { barcodeDefinition } from './$barcodeDefinition';
import { stringDefinition } from './$stringDefinition';
import { clothingCareDefinition } from './$clothingCareDefinition';
import { embedDefinition } from './$embedDefinition';
import { materialsDefinition } from './$materialsDefinition';

export const $metas = {
    // dbList: dbListMeta,
    barcode: barcodeDefinition,
    bool: boolDefinition,
    clothingCare: clothingCareDefinition,
    date: dateDefinition,
    dictionary: dictionaryDefinition,
    dollar: dollarDefinition,
    embed: embedDefinition,
    enum: enumDefinition,
    flags: flagsDefinition,
    float: floatDefinition,
    int: intDefinition,
    list: listDefinition,
    lookup: lookupDefinition,
    materials: materialsDefinition,
    oid: objectIdMeta,
    percent: percentageDefinition,
    set: setDefinition,
    string: stringDefinition,
};