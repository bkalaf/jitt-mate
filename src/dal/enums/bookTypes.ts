import { enumColors } from './enumColors';

export const BookTypesInfos = {
    hb: { key: 'hardback', color: enumColors.cyan2 },
    pb: { key: 'paperback', color: enumColors.rose2 },
    bb: { key: 'board-book', color: enumColors.orange2 },
};

export type BookTypesKeys = keyof typeof BookTypesInfos;
export const BookTypesEnumMap = Object.fromEntries(Object.entries(BookTypesInfos).map(([k, v]) => [k, v.key] as [BookTypesKeys, string])) as Record<BookTypesKeys, string>;
export const BookTypesColorMap = Object.fromEntries(Object.entries(BookTypesInfos).map(([k, v]) => [k, v.color] as [BookTypesKeys, string])) as Record<BookTypesKeys, string>;
