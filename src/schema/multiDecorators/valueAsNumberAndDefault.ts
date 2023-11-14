import { composeDecorators } from '../composeDecorators';
import { valueProperty } from '../decorators/valueProperty';
import { defaultProperty } from '../decorators/defaultProperty';

export const valueAsNumberAndDefault = composeDecorators(defaultProperty('defaultValue'), valueProperty('valueAsNumber'));
