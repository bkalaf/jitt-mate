import { createContext } from 'react';
import * as Realm from 'realm';

export type     IRealmContext = {
    app: Realm.App;
    currentUser: Realm.User | null;
    db: Realm | null;
    isAuthenticated: () => boolean;
    logOut: () => Promise<void>;
    logIn: (creds: { email: string; password: string }) => Promise<void>;
    dbIsOpen: () => boolean;
    schema: Realm.RealmObjectConstructor<any>[];
};

export const RealmContext = createContext<IRealmContext | undefined>(undefined);
RealmContext.displayName = 'RealmContext';

