import { useProvideRealmContext } from '../../hooks/useProvideRealmContext';
import { RealmContext } from '../contexts/RealmContext';

export function RealmProvider({ children }: { children: Children }) {
    const value = useProvideRealmContext();
    return <RealmContext.Provider value={value}>{children}</RealmContext.Provider>;
}
