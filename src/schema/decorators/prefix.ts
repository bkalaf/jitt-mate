import { outputFormatter } from './outputFormatter';

export const prefix = (pref: string) => outputFormatter((x) => (x != null ? [pref, x].join('') : ''));
