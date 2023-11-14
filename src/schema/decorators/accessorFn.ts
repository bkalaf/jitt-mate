import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { pipeDecorators } from '../pipeDecorators';
import { disableEditing } from './disableEditing';

export const id = function(_target: any, context: ClassFieldDecoratorContext) {
    if (context.metadata[context.name] == null) context.metadata[context.name] = {};
    (context.metadata[context.name] as any).id = context.name;  
}
export function accessorFn<T extends EntityBase>(columnName: string, func: (x: T) => any) {
    return pipeDecorators(wrappedSetMetadata('accessorFn', func), wrappedSetMetadata('id', columnName), disableEditing);
    // return function setMetadata(_target: any, context: ClassFieldDecoratorContext) {
    //     const metadata = context.metadata[context.name];
    //     if (metadata == null) context.metadata[context.name] = {};
    //     (context.metadata[context.name] as Record<any, any>)[$propName] = value;
    // };
}
