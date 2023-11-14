import { $$imageInput, baseMetaDecorator } from '../../decorators/field/baseMetaDecorator';

(Symbol as any).dispose ??= Symbol.for('Symbol.dispose');
(Symbol as any).asyncDispose ??= Symbol.for('Symbol.asyncDispose');
(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');
/**
* @deprecated
*/
export function wrappedSetMetadata(metaDataProperty: string, metaDataPropertyValue: any) {
    return function setMetadata(_target: any, context: ClassFieldDecoratorContext) {
        if (context.metadata == null) {
            console.log(`null context.metadata`);
            return;
        }
        const metadata = context.metadata[context.name];
        if (metadata == null) context.metadata[context.name] = {};
        (context.metadata[context.name] as Record<any, any>)[metaDataProperty] = metaDataPropertyValue;
    };
}

export const strategy = {
    constant: <T>(value: T) => (context: any) => value,
    useColumnName: () => (context: any) => context.name,
    truthy: () => (context: any) => true,
    falsey: () => (context: any) => false,
    undef: () => (context: any) => undefined,
    zero: () => (context: any) => 0,
    two: () => (context: any) => 2,
    four: () => (context: any) => 4,
    applyFunction: (func: (x: string) => string) => (context: any) => func(context.name)
}
