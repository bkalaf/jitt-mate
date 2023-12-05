import {
    $$getValueFromElement,
    $$setElement} from '../../decorators/field/baseMetaDecorator';
import { getValueFromInputElement, setInputElementDefaultValue } from '../getValueFromInputElement';
import { identity } from '../../common/functions/identity';

const $getValue: typeof $$getValueFromElement & {
    fromInputElement: (func?: (x: string) => any) => FieldDecoratorFunc;
} = $$getValueFromElement as any;
$getValue.fromInputElement = (func: (x: string) => any = identity) => $$getValueFromElement(getValueFromInputElement, func);

const setDefault = {
    for: {
        inputElement: $$setElement(setInputElementDefaultValue)
    }
};

