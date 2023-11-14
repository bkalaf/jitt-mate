
export function meta(metaDataProperty: string, metaDataPropertyValue: any) {
    return function setMetadata(_target: any, context: ClassFieldDecoratorContext) {
        const metadata = context.metadata[context.name];
        if (metadata == null) context.metadata[context.name] = {};
        (context.metadata[context.name] as Record<any, any>)[metaDataProperty] = metaDataPropertyValue;
    };
}
export function metaPropertyName(metaDataProperty: string) {
    return function setMetadata(_target: any, context: ClassFieldDecoratorContext) {
        const metadata = context.metadata[context.name];
        if (metadata == null) context.metadata[context.name] = {};
        (context.metadata[context.name] as Record<any, any>)[metaDataProperty] = context.name.toString();
    };
}
export function metaFuncPropertyName(metaDataProperty: string, func: (x: string) => any) {
    return function setMetadata(_target: any, context: ClassFieldDecoratorContext) {
        const metadata = context.metadata[context.name];
        if (metadata == null) context.metadata[context.name] = {};
        (context.metadata[context.name] as Record<any, any>)[metaDataProperty] = func(context.name.toString());
    };
}
