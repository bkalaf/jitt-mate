import { compR } from '../../common/functions/composeR';
import { convertInches } from '../../common/text/convertInches';
import { pipeDecorators } from '../pipeDecorators';
import { preprocess } from '../decorators/preprocess';
import { suffix } from '../decorators/suffix';

export const asHundredthUnitOfMeasure = (uom: string, insertSpace = true, precisionIfNotFraction = 2) =>
    pipeDecorators(preprocess(compR((x?: number) => convertInches(x, precisionIfNotFraction))((x?: string) => x ?? '')), suffix((insertSpace ? ' ' : '').concat(uom)));
