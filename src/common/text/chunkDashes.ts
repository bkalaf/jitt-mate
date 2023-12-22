import { chunkBy } from '../array/chunkBy';

export const chunkDashes = (str: string) => chunkBy(4)(str.split(''))
    .map((x) => x.join(''))
    .join('-');
