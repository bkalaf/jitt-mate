import { createContext } from 'react';
import Realm from 'realm';

export type     IRealmContext = {
    app: Realm.App;
    currentUser: Realm.User | null;
    db: Realm | null;
    isAuthenticated: () => boolean;
    logOut: () => Promise<void>;
    logIn: (creds: { email: string; password: string }) => Promise<void>;
    dbIsOpen: () => boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: Realm.RealmObjectConstructor<any>[];
};

export const RealmContext = createContext<IRealmContext | undefined>(undefined);
RealmContext.displayName = 'RealmContext';

