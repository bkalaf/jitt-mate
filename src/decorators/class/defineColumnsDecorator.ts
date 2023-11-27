import { ctorColumnDef } from '../../reflect/ctorColumnDef';

export function staticColumnsDecorator(target: any, context: ClassMethodDecoratorContext) {
    function innerDecorator(this: any, ...prefixes: string[]): DefinedColumns {
        const metadata = (this as any)[Symbol.metadata] as Record<string, any>;
        return Object.entries(metadata['fields'] ?? {}).map(([k, v]) => ctorColumnDef(...prefixes)([k, v as any])) as any as DefinedColumns
    }
    return innerDecorator;
}