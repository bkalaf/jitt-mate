import { $$ } from '../comparator/areRealmObjectsEqual';
import { distinctBy } from './distinctBy';

export const distinctByRealmObjects = distinctBy($$.realmObject.equalTo);