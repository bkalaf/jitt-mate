import { getAssoc } from '../../common/object/getAssoc';
import { objectMap } from './objectMap';

export const LocationTypesObj = {
    fixture: { text: 'fixture', color: 'bg-indigo-600 text-white' },
    shelf: { text: 'shelf', color: 'bg-rose-600 text-white'},
    bin: { text: 'bin', color: 'bg-yellow-600 text-black'}
}

export const LocationTypes = objectMap(getAssoc<{ text: string }, 'text'>('text', ''))(LocationTypesObj);
export const LocationTypesColors = objectMap(getAssoc<{ color: string }, 'color'>('color', ''))(LocationTypesObj);


export type LocationTypes = typeof LocationTypes;

