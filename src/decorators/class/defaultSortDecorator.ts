import { DeepKeys } from '@tanstack/react-form';
import { _ } from '../../metadata/decorators/_';

export function defaultSortDecorator<T>(...descriptors: (DeepKeys<T> | [keyof T, boolean])[]) {
    return function labelledByDecorator(target: { new (...args: any[]): T }, context: ClassDecoratorContext) {
        _(context)['defaultSort'] = descriptors.map((x) => (typeof x === 'string' ? [x, false] : x));
    };
}
