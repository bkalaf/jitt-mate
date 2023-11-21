/* eslint-disable @typescript-eslint/no-explicit-any */
import { labelledByDecorator } from './labelledByDecorator';
import { defaultSortDecorator } from './defaultSortDecorator';
import { pipeDecorators } from '../../schema/pipeDecorators';
import { DeepKeys } from '@tanstack/react-form';

export function realmCollectionDecorator<T>(labelledBy: DeepKeys<T>, ...descriptors: (keyof T | [keyof T, boolean])[]) {
    return pipeDecorators(
        // defineColumnsDecorator,
        labelledByDecorator<T>(labelledBy as any),
        defaultSortDecorator(...(descriptors as any))
    );
}
