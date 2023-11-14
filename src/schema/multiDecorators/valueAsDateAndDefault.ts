import { composeDecorators } from '../composeDecorators';
import { valueProperty } from '../decorators/valueProperty';
import { defaultProperty } from '../decorators/defaultProperty';

export const valueAsDateAndDefault = composeDecorators(defaultProperty('defaultValue'), valueProperty('valueAsDate'));

