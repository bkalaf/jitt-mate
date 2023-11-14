import { datatype } from '../decorators/datatype';
import { objectType } from '../decorators/objectType';
import { determinate } from '../decorators/determinate';
import { pipeDecorators } from '../pipeDecorators';
import { accessorFn } from '../decorators/accessorFn';
import { required } from '../decorators/required';
import { inputType } from '../decorators/inputType';
import { indexed } from './indexed';


export const asDistinctList = <T extends EntityBase>(ot: RealmObjects) =>
    pipeDecorators(
        datatype('set'),
        objectType(ot),
        determinate,
        accessorFn<T>(name, (x: T) => (x[name as keyof T] as DBSet<any>).size)
    );

export const asUnique = <T extends EntityBase>($datatype: RealmTypes = 'string') => pipeDecorators(datatype($datatype), indexed, required, inputType('text'));
