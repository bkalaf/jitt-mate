import { ReflectionContext } from './ReflectionContext';
import { useProvideReflectionContext } from '../../hooks/useProvideReflectionContext';


export function ReflectionProvider({ children }: { children?: Children; }) {
    const value = useProvideReflectionContext();
    return <ReflectionContext.Provider value={value}>
        {children}
    </ReflectionContext.Provider>;
}
