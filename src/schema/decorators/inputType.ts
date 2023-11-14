import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { composeDecorators } from '../composeDecorators';
import { tagName } from './tagName';

export function inputType(inputType: React.HTMLInputTypeAttribute = 'text') {
    return composeDecorators(wrappedSetMetadata('inputType', inputType ?? 'text'), tagName('input'));
}
