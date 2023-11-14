import { composeR } from '../../common/functions/composeR';
import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function outputFormatter(func: (x: string) => string) {
    return (_target: any, context: ClassFieldDecoratorContext) => {
        const current = context.metadata[context.name];
        if (current != null) {
            const func2 = composeR(current, func);
            return wrappedSetMetadata('postProcess-preDisplay', func2);
        }
        return wrappedSetMetadata('postProcess-preDisplay', func);
    };
}
