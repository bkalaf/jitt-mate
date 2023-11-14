import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { datatype } from '../decorators/datatype';
import { pipeDecorators } from '../pipeDecorators';

/**
* @deprecated
*/
export const stringLength = (values: { min?: number; max?: number }) => {
    if (values.min != null && values.max != null) return pipeDecorators(datatype('string'), wrappedSetMetadata('minLength', values.min), wrappedSetMetadata('maxLength', values.max));
    if (values.min != null) return pipeDecorators(datatype('string'), wrappedSetMetadata('minLength', values.min));
    if (values.max != null) return pipeDecorators(datatype('string'), wrappedSetMetadata('maxLength', values.max));
    return datatype('string');
};
