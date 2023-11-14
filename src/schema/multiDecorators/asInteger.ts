import { pipeDecorators } from '../pipeDecorators';
import { datatype } from '../decorators/datatype';
import { step } from '../decorators/step';
import { inputType } from '../decorators/inputType';
import { valueAsNumberAndDefault } from './valueAsNumberAndDefault';
import { enumMap } from '../decorators/enumMap';
import { colorMap } from '../decorators/colorMap';

export const asInteger = pipeDecorators(datatype('int'), step(1), inputType('number'), valueAsNumberAndDefault);
// export const asEnum = <TKey extends string, TValue = string>($enumMap: EnumMap<TKey & string, TValue & string>, $colorMap?: Record<string, string>) =>
//     pipeDecorators(datatype('enum'), enumMap($enumMap), ...($colorMap ? [colorMap($colorMap)] : []));
export const asRadioEnum = undefined;
export const asDropdownEnum = undefined;
export const asDatalistEnum = undefined;
