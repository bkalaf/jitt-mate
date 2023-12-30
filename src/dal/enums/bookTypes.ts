import { enumColors } from './enumColors';

export const BookTypesInfos = {
    hb: { key: 'hardback', color: enumColors.cyan2 },
    pb: { key: 'paperback', color: enumColors.rose2 },
    bb: { key: 'board-book', color: enumColors.orange2 },
};

export type BookTypesKeys = keyof typeof BookTypesInfos;