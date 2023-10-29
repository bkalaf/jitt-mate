// import $$schema from '.';
// import { catchError } from '../components/catchError';
// import * as Config from './../config.json';
// import Realm from 'realm';

// const app = new Realm.App({ id: Config.realm.appID });
// console.log(app);
// let user: Realm.User | null = null;
// let realm: Realm | null = null;

// const lock = app.logIn(Realm.Credentials.emailPassword({ email: 'admin@junk-in-the-trunk.com', password: 'diane1221' })).then(u => {
//     console.log('User logged in');
//     console.log(u.profile.email);
//     user = u;
//     const config: Realm.ConfigurationWithSync = {
//         schema: $$schema,
//         sync: {
//             partitionValue: user?.profile?.email ?? 'n/a',
//             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             user: user!
//         }
//     };
//     return Realm.open(config).then(r => {
//         realm = r;
//         realm.write(() => {
//             const hasTags = realm.objects('product').filtered('hasTags == $0', null);
//             const isVintage = realm.objects('product').filtered('isVintage == $0', null);
//             const isRare = realm.objects('product').filtered('isRare == $0', null);
//             const notes = realm.objects('product').filtered('notes == $0', null);
//             hasTags.forEach(x => x.hasTags = true);
//             isVintage.forEach(x => x.isVintage = false)
//             isRare.forEach(x => x.isRare = false);
//             notes.forEach(x => x.notes = '')
//         })
//     }).catch(catchError);
// }).catch(catchError).finally(() => console.log('realm opened'));
