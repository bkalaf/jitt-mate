import { pipeDecorators } from '../pipeDecorators';
import { multiplier } from '../decorators/multiplier';
import { precision } from '../decorators/precision';
import { suffix } from '../decorators/suffix';

export const asPercentage = pipeDecorators(multiplier(100), precision(2), suffix('%'));
