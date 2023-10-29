import { useProvidedContext } from '../../hooks/useProvidedContext';
import { FormContext, IFormContext } from './FormContext';

export function useFormContext<T = AnyObject, TResultant = void>() {
    return useProvidedContext<IFormContext<T, TResultant>>(FormContext as any) as IFormContext<T, TResultant>;
}
