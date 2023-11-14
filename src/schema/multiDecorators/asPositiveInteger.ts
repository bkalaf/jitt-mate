import { pipeDecorators } from '../pipeDecorators';
import { asInteger } from './asInteger';
import { minValue } from '../decorators/minValue';

export const asPositiveInteger = pipeDecorators(asInteger, minValue(0));
