import { composeDecorators } from '../composeDecorators';
import { valueProperty } from '../decorators/valueProperty';
import { defaultProperty } from '../decorators/defaultProperty';
import { pipeDecorators } from '../pipeDecorators';
import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export const valueAndDefaultValue = composeDecorators(defaultProperty('defaultValue'), valueProperty('value'));

export const multiple = (multi = false) => wrappedSetMetadata('multiple', multi);
export const selectedOptionsAndDefaultValue = pipeDecorators(defaultProperty('defaultValue'), valueProperty('selectedOptions'))