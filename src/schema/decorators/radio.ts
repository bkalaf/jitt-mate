import { pipeDecorators } from '../pipeDecorators';
import { valueProperty } from './valueProperty';
import { inputType } from './inputType';

export function radio() {
    return pipeDecorators(inputType('radio'), valueProperty('checked'));
}
