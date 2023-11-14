import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function defaultProperty(dProp: 'defaultChecked' | 'defaultValue') {
    return wrappedSetMetadata('defaultProperty', dProp);
}
