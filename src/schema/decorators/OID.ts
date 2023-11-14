import { BSON } from 'realm';
import { fromOID } from '../../dal/fromOID';
import { chunkBy } from '../../common/array/chunkBy';
import { pipeDecorators } from '../pipeDecorators';
import { datatype } from './datatype';
import { required } from './required';
import { immutable } from './immutable';
import { columnName } from './columnName';
import { preprocess } from './preprocess';
import { outputFormatter } from './outputFormatter';
import { initializer } from './initializer';
import { tooltip } from './tooltip';

export function OID<T extends EntityBase>() {
    return pipeDecorators(
        datatype('objectId'),
        required(),
        immutable(),
        initializer(async () => new BSON.ObjectId()),
        tooltip((x: T) => {
            const f = (x: OID) => {
                const str = fromOID(x);
                return chunkBy(4)(str.split(''))
                    .map((x) => x.join(''))
                    .join('-');
            };
            return f(x._id);
        }),
        preprocess(fromOID),
        columnName('_id'),
        
    );
}
