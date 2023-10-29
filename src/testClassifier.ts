/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Config from './config.json';
import Realm from 'realm';
const BSON = Realm.BSON;
import * as fs from 'graceful-fs';
import $$schema from './dal';
import { IClassifier } from './dal/types';
import { toClassifierName } from './dal/toClassifierName';

const app = new Realm.App({ id: Config.realm.appID });
console.log(app);
let user: Realm.User | null = null;
let realm: Realm | null = null;

const lock = app
    .logIn(Realm.Credentials.emailPassword({ email: 'admin@junk-in-the-trunk.com', password: 'diane1221' }))
    .then((u) => {
        console.log('User logged in');
        console.log(u.profile.email);
        user = u;
        const config: Realm.ConfigurationWithSync = {
            schema: $$schema,
            sync: {
                partitionValue: user?.profile?.email ?? '',
                user: user!,
                clientReset: {
                    mode: 'recoverOrDiscardUnsyncedChanges' as Realm.ClientResetMode
                }
            }
        };
        return Realm.open(config)
            .then((r) => (realm = r))
    })
    .finally(() => console.log('realm opened'));

export function reducePromise(f: () => Promise<void>, g: () => Promise<void>) {
    return async () => {
        await f();
        await g();
    };
}


lock.then(() => {
    realm!.objects<IClassifier>('classifier').forEach(c => {
        const name = toClassifierName(c);
        const currentName = c.name;
        console.log(`name: ${name}`)
        console.log(`currentName: ${currentName}`);
        console.log('');
    })
    return realm!.syncSession
        ?.uploadAllLocalChanges()
        .finally(() => console.log('DONE!'));
});
