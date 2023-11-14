import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function valueProperty(valueProp: 'checked' | 'selectedOptions' | 'value' | 'valueAsNumber' | 'valueAsDate') {
    return wrappedSetMetadata('valueProperty', valueProp);
}
