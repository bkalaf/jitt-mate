import { useContext } from 'react';

export function useProvidedContext<T>(context: React.Context<T>) {
    const ctxt = useContext(context) as T | undefined;
    if (ctxt == null) throw new Error(`useProvidedContext result is null: ${context.displayName}.`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ctxt!;
}
