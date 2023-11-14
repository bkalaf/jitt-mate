import { composeDecorators } from '../composeDecorators';
import { valueProperty } from '../decorators/valueProperty';
import { defaultProperty } from '../decorators/defaultProperty';

export const checkedAndDefaultChecked = composeDecorators(defaultProperty('defaultChecked'), valueProperty('checked'));
