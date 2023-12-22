import { getAssoc } from '../../common/object/getAssoc';
import { objectMap } from './objectMap';

export function toEnumMap(obj: Record<string, { text: string; color: string }>) {
    return [objectMap(getAssoc<{ text: string }, 'text'>('text', ''))(obj), objectMap(getAssoc<{ color: string }, 'color'>('color', ''))(obj)];
}
