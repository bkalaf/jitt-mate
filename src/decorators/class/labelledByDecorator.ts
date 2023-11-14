import { _ } from '../../metadata/decorators/_';

export function labelledByDecorator<T>(key: keyof T & string) {
    return function labelledByDecorator(target: { new (...args: any[]): T }, context: ClassDecoratorContext) {
        _(context)['labelProperty'] = key;
    };
}
