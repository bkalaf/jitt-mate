import { useProvideToasterContext } from '../../hooks/useProvideToasterContext';
import { ToasterContext } from '../Contexts/ToasterContext';

export function ToasterProvider({ children }: { children: Children }) {
    const value = useProvideToasterContext();
    return <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>;
}
