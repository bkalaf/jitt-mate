import { composeR } from '../../common/functions/composeR';
import { identity } from '../../common/functions/identity';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { toCamelCase } from '../../dal/enums/toCamelCase';
import { strategy } from '../../dal/types/wrappedSetMetadata';
import { pipeDecorators } from '../../schema/pipeDecorators';
import { _ } from '../../metadata/decorators/_';
import { rightMap } from '../../metadata/decorators/rightMap';
import { dateFromNow } from '../../common/date/dateFromNow';
import { IHashTag } from '../../dal/types';

export function baseMetaDecorator(metaPropertyName: string, valueGenerator: (ctxt: ClassFieldDecoratorContext | ClassGetterDecoratorContext) => any) {
    return function <T extends ClassFieldDecoratorContext | ClassGetterDecoratorContext>(_target: any, context: T) {
        if (context.metadata == null) return;
        _(context)[metaPropertyName] = valueGenerator(context);
    };
}

export function initializeEmptyObject(_target: any, context: ClassFieldDecoratorContext) {
    context.addInitializer(function() {
        if (_(context)[context.name.toString()] == null) {
            console.log(`${context.name.toString()} value is null - initializing empty object`);
            (this as any)[context.name] = {};
        }  
    })
}
export function initializeEmptyArrayDecorator(_target: any, context: ClassFieldDecoratorContext) {
    context.addInitializer(function () {
        if (_(context)[context.name.toString()] == null) {
            console.log(`${context.name.toString()} value is null - initializing empty array`);
            (this as any)[context.name] = [];
        }
    });
}
export function initializeTimestamp(_target: any, context: ClassFieldDecoratorContext) {
    context.addInitializer(function() {
        if (_(context)[context.name.toString()] == null) {
            console.log(`${context.name.toString()} value is null - initializing empty array`);
            (this as any)[context.name] = dateFromNow();
        }
    })
    _(context).initializer = () => Promise.resolve(dateFromNow())
}
export const $$embedded = initializeEmptyObject;
export const $$intialDictionary = initializeEmptyObject;
export const $$intialList = initializeEmptyArrayDecorator;
export const $$intialSet = initializeEmptyArrayDecorator;


export const $$maxLength = (max: number) => baseMetaDecorator('maxLength', strategy.constant(max));
export const $$minLength = (max: number) => baseMetaDecorator('minLength', strategy.constant(max));
export const $$pattern = (pattern: string) => baseMetaDecorator('pattern', strategy.constant(pattern));
export const $$max = (max: number) => baseMetaDecorator('max', strategy.constant(max));
export const $$min = (max: number) => baseMetaDecorator('min', strategy.constant(max));
export const $$step = (max: number) => baseMetaDecorator('step', strategy.constant(max));

export const $$tag = (tag: string) => baseMetaDecorator('tagType', strategy.constant(tag));
export const withInputElementDecorator = $$tag('input');
export const $$select = $$tag('select');
export const $$textarea = $$tag('textarea');
export const $$dataType = (dt: RealmTypes | 'linkingObjects') => baseMetaDecorator('datatype', strategy.constant(dt));
export const $$decimal128 = $$dataType('decimal128');
export const $$bool = $$dataType('bool');
export const $$string = $$dataType('string');
export const $$picklist = $$dataType('enum');
export const $$enum = (enumMap: Record<string, string>) => baseMetaDecorator('enumMap', strategy.constant(enumMap))
export const $$colorMap = (enumMap: Record<string, string>) => baseMetaDecorator('colorMap', strategy.constant(enumMap));
export const $$valuesGetter = (valuesGetter: any) => baseMetaDecorator('valuesGetter', strategy.constant(valuesGetter));

export const $$int = $$dataType('int');
export const $$double = $$dataType('double');
export const $$float = $$dataType('float');
export const $$data = $$dataType('data');
export const $$date = $$dataType('date');
export const $$objectId = $$dataType('objectId');
export const $$uuid = $$dataType('uuid');
export const $$object = (objectType: RealmTypes | RealmObjects) => pipeDecorators($$dataType('object'), withObjectTypeDecorator(objectType as any));
export const $$backlink = (objectType: string) => pipeDecorators($$dataType('linkingObjects'), withObjectTypeDecorator(objectType as any));
export const disableEdittingDecorator = baseMetaDecorator('enableEditting', strategy.falsey());
export const $$inputType = (type: React.HTMLInputTypeAttribute) => baseMetaDecorator('inputType', strategy.constant(type));
export const $$isOptional = baseMetaDecorator('required', strategy.falsey());
export const $$isRequired = baseMetaDecorator('required', strategy.truthy());
export const withImmutable = baseMetaDecorator('readOnly', strategy.truthy());
export const $$precision = (precision: number) => baseMetaDecorator('precision', strategy.constant(precision));
export const withObjectTypeDecorator = (objectType: RealmTypes | RealmObjects) => baseMetaDecorator('objectType', strategy.constant(objectType));
export const $$isCollectionOf = (listType: 'list' | 'dictionary' | 'set', listOf: RealmTypes | RealmObjects) => pipeDecorators($$dataType(listType), withObjectTypeDecorator(listOf));
export const $$isUnique = baseMetaDecorator('indexed', strategy.truthy());
export const $$isEmbedded = baseMetaDecorator('embedded', strategy.truthy());
export const asLookupObjectDecorator  = baseMetaDecorator('embedded', strategy.falsey());


/**
 * @description sets { datatype: 'list', objectType: $arg1 }
 * @author Robert Kalaf Jr.
 * @date 11/12/2023
 * @export
 * @param {(RealmObjects | RealmTypes)} listOf
 * @returns {*}  
 */
export function asListDecorator(listOf: RealmObjects | RealmTypes): FieldDecoratorFunc {
    return $$isCollectionOf('list', listOf);
}
export const $$dictionary = (listOf: RealmObjects | RealmTypes) => $$isCollectionOf('dictionary', listOf);
export const $$set = (listOf: RealmObjects | RealmTypes) => $$isCollectionOf('set', listOf);
export const $$emailInput = pipeDecorators(withInputElementDecorator, $$inputType('email'));
export const $$urlInput = pipeDecorators(withInputElementDecorator, $$inputType('url'));
export const $$telInput = pipeDecorators(withInputElementDecorator, $$inputType('tel'));
export const $$numberInput = pipeDecorators(withInputElementDecorator, $$inputType('number'));
export const $$passwordInput = pipeDecorators(withInputElementDecorator, $$inputType('password'));
export const $$dateInput = pipeDecorators(withInputElementDecorator, $$inputType('date'));
export const $$datetimeInput = pipeDecorators(withInputElementDecorator, $$inputType('datetime-local'));
export const withCheckboxDecorator = pipeDecorators(withInputElementDecorator, $$inputType('checkbox'));
export const $$radioGroupInput = pipeDecorators(withInputElementDecorator, $$inputType('radio'));
export const withTextTypeInputDecorator = pipeDecorators(withInputElementDecorator, $$inputType('text'));
export const $$fileInput = pipeDecorators(withInputElementDecorator, $$inputType('file'));
export const $$searchInput = pipeDecorators(withInputElementDecorator, $$inputType('search'));
export const $$imageInput = pipeDecorators(withInputElementDecorator, $$inputType('image'));
export const $$hiddenInput = pipeDecorators(withInputElementDecorator, $$inputType('hidden'));
export const $$ctor = (Ctor: EntityConstructor<any>) => baseMetaDecorator('objectCtor', strategy.constant(Ctor));

export const $$autoAccessorKey = baseMetaDecorator('accessorKey', strategy.useColumnName());
export const withAccessorFnDecorator = (fn: (func: any) => string) => baseMetaDecorator('accessorFn', strategy.constant(fn));
export const withAutoHeaderDecorator = baseMetaDecorator('header', strategy.applyFunction(toProperFromCamel));
export const withHeaderDecorator = (header: string) => baseMetaDecorator('header', strategy.constant(header));
export const $$footer = baseMetaDecorator('footer', strategy.applyFunction(toCamelCase));
export const $$datalist = baseMetaDecorator('isDataList', strategy.truthy);
export const $$dropdown = baseMetaDecorator('isDropDown', strategy.truthy);

export const $$getValueFromElement = <T extends HTMLElement>(fn: (func: T) => string | string[], converter: (x: string) => any = identity) => baseMetaDecorator('getValueFromElement', strategy.constant(composeR(fn, converter)));
export const $$initializer = (fn: () => Promise<unknown>) => baseMetaDecorator('initializer', strategy.constant(fn));
export const $$setElement = <TElement extends HTMLElement, T>(fn: (el: TElement, value?: T) => void, converter?: (x: any) => T) =>
    baseMetaDecorator('setElementDefault', strategy.constant(converter != null ? rightMap<TElement, any, T>(fn)(converter ?? identity) : fn));
export const $$formatOutput = (fn: (str: string) => string) => baseMetaDecorator('formatOutput', strategy.constant(fn));
export const $$id = (x: string) => baseMetaDecorator('id', strategy.constant(x));
export const withAutoIDDecorator = baseMetaDecorator('id', strategy.useColumnName())
export const $$tooltip = (x: (x?: any) => string) => baseMetaDecorator('tooltip', strategy.constant(x));
export const $$accessorFnDBSetDecorator = <T extends { hashTags: DBSet<Entity<IHashTag>> }>(_target: any, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext) => withAccessorFnDecorator((x: T) => x.hashTags?.size.toString() ?? 0)(_target, context);
export const $$accessorFnDBListDecorator = <T extends Record<string, DBList<any>>>(_target: any, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext) => {
    return withAccessorFnDecorator((x: T) => x[context.name.toString()].length.toString() ?? 0)(_target, context);
}
export function initializer<T>(func: () => Promise<T>) {
    return function (_this: any, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext) {
        context.addInitializer(function () {
            if (_this[context.name] == null) {
                console.log(`${context.name.toString()} value null - initializing`);
                func()
                    .then((x) => (_this[context.name] = x))
                    .finally(() => console.log(`${context.name.toString()} initialized.`));
            }
        });
        _(context).hasInitializer = true;
    };
}
