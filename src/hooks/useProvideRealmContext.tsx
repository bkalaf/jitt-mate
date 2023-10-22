import { useCallback, useMemo, useState } from 'react';
import Realm from 'realm';
import Config from '../config.json';
import $$schema from '../dto';
import { IRealmContext } from '../components/contexts/RealmContext';
import { useToasterContext } from './useToasterContext';
import { toastCatchBlock } from '../util/toastCatchBlock';

export function useProvideRealmContext(): IRealmContext {
    const app = useMemo(() => new Realm.App(Config.realm.appID), []);
    const [currentUser, setCurrentUser] = useState<Realm.User | null>(null);
    const [db, setDB] = useState<Realm | null>(null);
    const isAuthenticated = useCallback(() => currentUser != null, [currentUser]);
    const { createSuccessToast, createFailureToast, createErrorToast } = useToasterContext();
    const changeCurrentUser = useCallback((nextUser: null | Realm.User) => {
        if (nextUser == null) {
            setCurrentUser(null);
            setDB(null);
        } else {
            setCurrentUser(nextUser);
            Realm.open({
                schema: $$schema,
                sync: {
                    partitionValue: nextUser.profile?.email ?? 'n/a',
                    user: nextUser,
                    clientReset: {
                        mode: Realm.ClientResetMode.RecoverOrDiscardUnsyncedChanges
                    }
                }
            })
                .then(setDB)
        }
    }, []);
    const logOut = useCallback(async () => {
        try {
            if (currentUser == null) throw new Error('no currentUser to log out');
            await currentUser.logOut();
            changeCurrentUser(null);
            return createSuccessToast('You have logged out!', 'LOG OUT');
        } catch (error) {
            toastCatchBlock(createErrorToast, createFailureToast)(error);
        }
    }, [changeCurrentUser, createErrorToast, createFailureToast, createSuccessToast, currentUser]);
    const logIn = useCallback(
        async (creds: { email: string; password: string }) => {
            try {
                const u = await app.logIn(Realm.Credentials.emailPassword(creds));
                createSuccessToast(`Welcome back to JITT, ${u.profile.email}!`, 'LOGGGED IN');
                changeCurrentUser(u);
            } catch (error) {
                toastCatchBlock(createErrorToast, createFailureToast)(error);
            }
        },
        [app, changeCurrentUser, createErrorToast, createFailureToast]
    );
    return {
        app,
        currentUser,
        db,
        isAuthenticated,
        logOut,
        logIn
    };
}
