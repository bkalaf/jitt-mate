import { pipeDecorators } from '../pipeDecorators';
import { asDollarValue } from './asDollarValue';
import { withDefaultValueDecorator } from '../decorators/defaultValue';
import { minValue } from '../decorators/minValue';

export const asDollarZeroDefault = pipeDecorators(asDollarValue, minValue(0), withDefaultValueDecorator(0));
