import { datatype } from './datatype';
import { objectType } from './objectType';
import { determinate } from './determinate';

export const keyed = (ot: RealmTypes) => {
    determinate();
    datatype('dictionary');
    objectType(ot);
};
