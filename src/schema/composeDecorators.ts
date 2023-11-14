export function composeDecorators(decorator1: (_target: any, context: ClassFieldDecoratorContext) => void, decorator2: (_target: any, context: ClassFieldDecoratorContext) => void) {
    return (_target: any, context: ClassFieldDecoratorContext) => {
        decorator1(_target, context);
        decorator2(_target, context);
    };
}
