import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function tagName(tagName: 'input' | 'select' | 'textarea') {
    return wrappedSetMetadata('tagName', tagName);
}
