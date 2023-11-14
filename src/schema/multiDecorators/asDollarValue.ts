import { pipeDecorators } from '../pipeDecorators';
import { precision } from '../decorators/precision';
import { prefix } from '../decorators/prefix';

export const asDollarValue = pipeDecorators(precision(2), prefix('$'));
