import { konst } from '../common/functions/konst';


export function pipeDecorators<TContext extends ClassFieldDecoratorContext | ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassDecoratorContext>(...decorators: Array<(_target: any, context: TContext) => void>) {
    return (_target: any, context: TContext) => {
        return decorators.reduce(
            (pv, cv) => () => {
                pv(_target, context);
                cv(_target, context);
            },
            () => konst(undefined)
        )(_target, context);
    };
}
