import { LocalForageContext } from '../Contexts/LocalForageContext';
import { useProvideLocalForageContext } from '../../hooks/useProvideLocalForageContext';

export function LocalForageProvider({ children }: { children?: Children; }) {
    const context = useProvideLocalForageContext();
    return <LocalForageContext.Provider value={context}>
        {children}
    </LocalForageContext.Provider>;
}
