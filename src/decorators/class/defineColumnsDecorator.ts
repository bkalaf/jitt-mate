import { ctorColumnDef } from '../../reflect/ctorColumnDef';

export function defineColumnsDecorator(target: any, context: ClassDecoratorContext) {
    console.log(`CLASS: ${context.name}`);
    console.log(target);
    context.addInitializer(function () {
        console.log('this');
        console.log(this);
        console.log(`this.constructor: ${this.constructor.name}`);
        const metadata = context.metadata;
        (this as any).columns = (...prefixes: string[]) => Object.entries((this[Symbol.metadata] as any).fields ?? {}).map(([k, v]) => ctorColumnDef(...prefixes)([k, v as any]));
        // console.log('constructor');
        // console.log(this.constructor);
    });
}

export function staticColumnsDecorator(target: any, context: ClassMethodDecoratorContext) {
    function innerDecorator(this: any, ...prefixes: string[]): DefinedColumns {
        const metadata = (this as any)[Symbol.metadata] as Record<string, any>;
        return Object.entries(metadata['fields'] ?? {}).map(([k, v]) => ctorColumnDef(...prefixes)([k, v as any])) as any as DefinedColumns
    }
    return innerDecorator;
}