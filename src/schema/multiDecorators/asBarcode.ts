import { pipeDecorators } from '../pipeDecorators';
import { datatype } from '../decorators/datatype';
import { inputType } from '../decorators/inputType';
import { stringLength } from './stringLength';
import { outputFormatter } from '../decorators/outputFormatter';

export const asBarcode = pipeDecorators(
    datatype('string'),
    inputType('text'),
    stringLength({ min: 13, max: 13 }),
    outputFormatter((x: string) => {
        const ch = x.split('');
        return [ch[0], ch[1], ch.slice(2, 7).join(''), ch.slice(7, 12).join(''), ch[12]].join('-');
    })
);
