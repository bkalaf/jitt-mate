import { BSON } from 'realm';
import {
    withAccessorFnDecorator,
    $$autoAccessorKey,
    $$backlink,
    $$bool,
    withCheckboxDecorator,
    $$data,
    $$datalist,
    $$date,
    $$dateInput,
    $$datetimeInput,
    $$decimal128,
    $$dictionary,
    $$double,
    $$dropdown,
    $$emailInput,
    $$embedded,
    $$fileInput,
    $$float,
    $$footer,
    $$getValueFromElement,
    withAutoHeaderDecorator,
    $$hiddenInput,
    $$id,
    $$imageInput,
    withInputElementDecorator,
    $$int,
    withImmutable,
    $$isOptional,
    $$isRequired,
    $$isUnique,
    asListDecorator,
    $$numberInput,
    $$objectId,
    $$passwordInput,
    $$picklist,
    $$radioGroupInput,
    $$select,
    $$set,
    $$setElement,
    $$string,
    $$telInput,
    withTextTypeInputDecorator,
    $$textarea,
    $$urlInput,
    $$uuid,
    baseMetaDecorator,
    initializer,
    $$tooltip,
    $$formatOutput,
    $$inputType,
    $$object,
    withObjectTypeDecorator,
    $$initializer,
    $$maxLength,
    $$precision,
    $$isEmbedded,
    $$ctor,
    withAutoIDDecorator,
    withHeaderDecorator,
    $$intialList,
    $$accessorFnDBSetDecorator
} from '../../decorators/field/baseMetaDecorator';
import { getValueAsNumberFromInputElement, getValueFromInputElement, setInputElementDefaultValue } from '../getValueFromInputElement';
import { pipeDecorators } from '../../schema/pipeDecorators';
import { strategy } from './wrappedSetMetadata';
import { identity } from '../../common/functions/identity';
import { composeR } from '../../common/functions/composeR';
import { appendText } from '../../common/text/appendText';
import { prependText } from '../../common/text/prependText';
import { fromOID } from '../fromOID';
import { chunkDashes } from './chunkDashes';
import { toFixed } from './toFixed';
import { IHashTag } from '.';
import { ProductTaxonomy } from '../../dto/collections/ProductTaxonomy';

const $getValue: typeof $$getValueFromElement & {
    fromInputElement: (func?: (x: string) => any) => FieldDecoratorFunc;
} = $$getValueFromElement as any;
$getValue.fromInputElement = (func: (x: string) => any = identity) => $$getValueFromElement(getValueFromInputElement, func);

const setDefault = {
    for: {
        inputElement: $$setElement(setInputElementDefaultValue)
    }
};

export const META = {
    col: {
        taxon: pipeDecorators($$object, withObjectTypeDecorator('productTaxonomy'), $$embedded, $$isEmbedded, withAutoIDDecorator, withAutoHeaderDecorator, $$ctor(ProductTaxonomy)),
        categoryID: pipeDecorators($$string, $$isRequired, $$isUnique, $$maxLength(30), withTextTypeInputDecorator, $$autoAccessorKey, $$formatOutput(prependText('#')), withInputElementDecorator, withHeaderDecorator('ID')),
        shipWeightPercent: pipeDecorators(
            $$float,
            $$precision(4),
            withInputElementDecorator,
            $$autoAccessorKey,
            $$numberInput,
            withAutoHeaderDecorator,
            $$formatOutput(
                composeR(
                    (x: any): number => (typeof x === 'string' ? parseFloat(x) : (x as number)) * 100,
                    (x: number) => x.toFixed(2),
                    appendText('%')
                )
            ),
            $$getValueFromElement(composeR(getValueAsNumberFromInputElement, toFixed(4))),
            $$setElement(setInputElementDefaultValue, toFixed(4))
        ),
        name: pipeDecorators(
            $$string,
            $$maxLength(150),
            withInputElementDecorator,
            withTextTypeInputDecorator,
            $$isRequired,
            $$autoAccessorKey,
            $$isUnique,
            withImmutable,
            $$getValueFromElement(getValueFromInputElement),
            $$setElement(setInputElementDefaultValue),
            withAutoHeaderDecorator
        ),
        oid: pipeDecorators(
            $$objectId,
            withInputElementDecorator,
            withTextTypeInputDecorator,
            $$isRequired,
            withImmutable,
            withAccessorFnDecorator(composeR((x: any) => x._id, fromOID, chunkDashes)),
            $$setElement(setInputElementDefaultValue),
            initializer(() => Promise.resolve(new BSON.ObjectId())),
            $$id('_id'),
            baseMetaDecorator('header', strategy.constant('OID')),
            $$tooltip(chunkDashes)
        ),
        hashTags: pipeDecorators(
            $$set('hashTag'),
            withAutoHeaderDecorator,
            baseMetaDecorator('enableEditting', strategy.falsey()),
            withAutoIDDecorator,
            $$accessorFnDBSetDecorator,
            $$intialList
        )
    },
    bool: $$bool,
    string: {
        $: $$string,
        withMaxLength: (m: number) => pipeDecorators($$string, baseMetaDecorator('maxLength', strategy.constant(m)))
    },
    int: $$int,
    float: {
        $: $$float,
        percent: pipeDecorators($$float, $$inputType('number'), withInputElementDecorator)
    },
    double: $$double,
    decimal128: $$decimal128,
    data: $$data,
    date: $$date,
    objectId: $$objectId,
    uuid: $$uuid,
    picklist: $$picklist,
    list: asListDecorator,
    dictionary: $$dictionary,
    set: $$set,
    backlink: $$backlink,
    embed: (ot: RealmObjects) => pipeDecorators($$object, withObjectTypeDecorator(ot)),
    tag: {
        _input: withInputElementDecorator,
        _select: $$select,
        input: {
            email: $$emailInput,
            password: $$passwordInput,
            file: $$fileInput,
            text: withTextTypeInputDecorator,
            checkbox: withCheckboxDecorator,
            radio: $$radioGroupInput,
            url: $$urlInput,
            tel: $$telInput,
            number: $$numberInput,
            date: $$dateInput,
            datetime: $$datetimeInput,
            hidden: $$hiddenInput,
            image: $$imageInput
        },
        select: {
            dropdown: $$dropdown,
            datalist: $$datalist,
            radioGroup: $$radioGroupInput
        },
        textarea: $$textarea
    },
    is: {
        optional: $$isOptional,
        required: $$isRequired,
        immutable: withImmutable,
        unique: $$isUnique
    },
    disableEdit: baseMetaDecorator('enableEditting', strategy.falsey()),
    accessorKey: $$autoAccessorKey,
    accessorFn: withAccessorFnDecorator,
    autoHeader: withAutoHeaderDecorator,
    footer: $$footer,
    subColumns: $$embedded,
    id: $$id,
    autoID: baseMetaDecorator('id', strategy.useColumnName()),
    tooltip: $$tooltip,
    label: (str: string) => baseMetaDecorator('header', strategy.constant(str)),
    funcs: {
        getValue: $getValue,
        initializer: {
            objectId: initializer(() => Promise.resolve(new BSON.ObjectId()))
        },
        setDefault: setDefault,
        formatText: $$formatOutput
    }
};
