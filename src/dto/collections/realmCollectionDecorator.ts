import { defineColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { updateImmediatelyAfterConstruction } from '../../decorators/class/updateImmediatelyAfterConstruction';
import { labelledByDecorator } from '../../decorators/class/labelledByDecorator';
import { defaultSortDecorator } from '../../decorators/class/defaultSortDecorator';
import { pipeDecorators } from '../../schema/pipeDecorators';
import { DeepKeys } from '@tanstack/react-form';

export function realmCollectionDecorator<T>(labelledBy: DeepKeys<T>, ...descriptors: (keyof T | [keyof T, boolean])[]) {
    return pipeDecorators(
        // defineColumnsDecorator,
        labelledByDecorator<T>(labelledBy as any),
        defaultSortDecorator(...(descriptors as any))
    );
}
