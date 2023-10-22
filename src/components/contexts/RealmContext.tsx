import { createContext } from 'react';
import Realm from 'realm';
import { useProvideRealmContext } from '../../hooks/useProvideRealmContext';

export type IRealmContext = {
    app: Realm.App;
    currentUser: Realm.User | null;
    db: Realm | null;
    isAuthenticated: () => boolean;
    logOut: () => Promise<void>;
    logIn: (creds: { email: string; password: string }) => Promise<void>;
};

export const RealmContext = createContext<IRealmContext | undefined>(undefined);
RealmContext.displayName = 'RealmContext';

export function RealmProvider({ children }: { children: Children }) {
    const value = useProvideRealmContext();
    return <RealmContext.Provider value={value}>{children}</RealmContext.Provider>;
}
