import { useProvideRealmContext } from '../../hooks/useProvideRealmContext';
import { RealmContext } from '../Contexts/RealmContext';

export function RealmProvider({ children }: { children: Children }) {
    const value = useProvideRealmContext();
    return <RealmContext.Provider value={value}>{children}</RealmContext.Provider>;
}
