import { _ } from '../../metadata/decorators/_';

export function defineCalculatedField<T extends AnyObject, TResult>(func: (arg: T) => TResult) {
    return function (_target: any, context: ClassFieldDecoratorContext) {
        const calculatedFieldsSymbol = Symbol.calculatedFields;
        context.addInitializer(function () {
            if (context.metadata[calculatedFieldsSymbol] == null) {
                context.metadata[calculatedFieldsSymbol] = [];
            }
            (context.metadata[calculatedFieldsSymbol] as any[]).push((obj: T) => {
                console.log(`calculated field updating: ${context.name.toString()}`);
                const result = func.call(null, this as T) as any;
                console.log(result);
                obj[context.name.toString() as keyof T] = result;
                return obj;
            });
        });
        _(context).calculated = true;
    };
}
