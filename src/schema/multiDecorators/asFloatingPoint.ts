import { pipeDecorators } from '../pipeDecorators';
import { precision } from '../decorators/precision';

export const asFloatingPoint = (thousandthUOM: FieldDecoratorFunc, precise = 2) => pipeDecorators(precision(precise), thousandthUOM);
