import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { pipeDecorators } from '../pipeDecorators';
import { inputType } from './inputType';
import { tagName } from './tagName';

export const step = (step: number) => pipeDecorators(wrappedSetMetadata('step', step), tagName('input'), inputType('number'));
