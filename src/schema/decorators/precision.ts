import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { pipeDecorators } from '../pipeDecorators';
import { datatype } from './datatype';
import { preprocess } from './preprocess';
import { step } from './step';

export const precision = (prec = 2) =>
    pipeDecorators(
        wrappedSetMetadata('precision', prec),
        datatype('float'),
        step(1 / (10 ^ prec)),
        preprocess((x: number) => x.toFixed(prec))
    );
