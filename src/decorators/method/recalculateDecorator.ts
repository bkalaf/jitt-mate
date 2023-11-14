import { identity } from '../../common/functions/identity';

export function recalculateDecorator<T extends AnyObject>(original: (this: T) => T, context: ClassMethodDecoratorContext) {
    function innerDecorator(this: T) {
        console.log(original);
        console.log(this);
        const fields = (this as any)[Symbol.metadata][Symbol.calculatedFields] as Array<(obj: T) => T>;
        return fields.reduce(
            (pv, cv) => (x: T) => {
                return cv(pv(x));
            },
            original
        )(this);
    }
    return innerDecorator;
}
