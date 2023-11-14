import { checkTransaction } from '../util/checkTransaction';

export function wrapInTransactionDecorator<T>() {
    return function <TArgs extends AnyArray>(originalMethod: (this: T, ...args: TArgs) => T, context: ClassMethodDecoratorContext) {
        console.log(`TRANSACTION METHOD DECORATOR FOR ${context.name.toString()}`);
        function transactedMethod(this: T, ...args: TArgs) {
            if (window.$$store == null) throw new Error('no realm for transaction');
            checkTransaction(window.$$store)(() => originalMethod.call(this, ...args));
            return this;
        }
        return transactedMethod;
    };
}
