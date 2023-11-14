import { pipeDecorators } from '../pipeDecorators';
import { inputType } from '../decorators/inputType';
import { stringLength } from './stringLength';
import { pattern } from '../decorators/pattern';
import { optional } from '../decorators/optional';

export const asYearString = pipeDecorators(stringLength({ min: 4, max: 4 }), inputType('year'), pattern(/^[1-2][0-9]{3}$/), optional);
