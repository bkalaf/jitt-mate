import { pipeDecorators } from '../pipeDecorators';
import { datatype } from '../decorators/datatype';
import { checkedAndDefaultChecked } from './checkedAndDefaultChecked';
import { inputType } from '../decorators/inputType';
import { withDefaultValueDecorator } from '../decorators/defaultValue';

export function asBool(dValue = false) {
    return pipeDecorators(datatype('bool'), inputType('checkbox'), checkedAndDefaultChecked, withDefaultValueDecorator(dValue));
}
