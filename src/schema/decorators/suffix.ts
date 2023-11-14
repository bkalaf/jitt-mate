import { outputFormatter } from './outputFormatter';


export const suffix = (suff: string) => outputFormatter((x) => (x != null ? [x, suff].join('') : ''));
