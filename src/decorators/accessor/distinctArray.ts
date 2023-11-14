import { $$ } from '../../common/comparator/areRealmObjectsEqual';

export function wrapDistinctArrayAccessorDecorator<T extends AnyObject, TValue>(key: keyof TValue) {
    return function (target: any, context: ClassGetterDecoratorContext<T, TValue[]>) {
        function get(this: T) {
            // const arr = context.access.get(this);
            // return $$.object.distinct<TValue & AnyObject, keyof TValue>(key)(arr as any[]) as TValue[];
            const result = target.bind(this)();
            return $$.object.distinct<TValue & AnyObject, keyof TValue>(key)(result) as TValue[];
        }
        return get;
    };
}
