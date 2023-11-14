import { catchError } from './components/catchError';
import * as Config from './config.json';
import Realm from 'realm';
import $$schema from './dal';
import { IDraft } from './dal/db';
import { IBarcode, IClassifier, ILocationSegment, IProduct, ISku } from './dal/types';
import { Barcode } from './dto/collections/Barcode';
import { checkTransaction } from './util/checkTransaction';
const BSON = Realm.BSON;

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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                partitionValue: user?.profile?.email!,
                user: user!
            }
        };
        return Realm.open(config)
            .then((r) => (realm = r))
            .catch(catchError);
    })
    .catch(catchError)
    .finally(() => console.log('realm opened'));

lock.then(async () => {
    console.log(Barcode.getEANCheckDigit('0088979931705'));
    const r = realm!;
    const skus = r.objects<ISku>('sku');
    const products = r.objects<IProduct>('product').filter((x) => x._barcodes.length > 0);
    console.log(`products`, products.length);
    // const func = () => {
    //     skus.forEach(s => {
    //         // ls.barcode = Barcode.ctorWithoutCheckdigit(ls._barcode) as IBarcode;
    //         s.sku = Barcode.ctorWithoutCheckdigit(s._barcode ?? '0') as IBarcode;
    //     });
    //     // products.forEach((prod) => {
    //     //     try {
    //     //         prod.upcs = prod._barcodes.map((x) => {
    //     //             return Barcode.ctorWithoutCheckdigit(x)
    //     //         }) as any;
    //     //     } catch (error) {
    //     //         console.log((error as any).message);
    //     //     }   
    //     // });
    // };
    // checkTransaction(r)(func);
    const func2 = () => {
        skus.forEach((p) => {
            p.sku?.update(r);
        });
    };
    checkTransaction(r)(func2);
    // const test = '499999000274';
    // const result = drafts.find(x => x.barcode?.scanEqual(test));
    // console.log(result?.toJSON());
    // const result = await r.syncSession?.user
    //     .mongoClient('mongodb-atlas')
    //     .db('jitt-mate')
    //     .collection('sku')
    //     .updateMany({ }, { $unset: { sku: null }})
    // console.log(result?.matchedCount);
    // console.log(result?.modifiedCount);
    // // r.write(() => {
    // //     // drafts.forEach((draft) => draft.autofill(r))
    // //     drafts.forEach((d: any) => {
    // //         d.isAthletic = false;
    // //     })
    // // });
    // // writeBarcodeLabels(r);
    return await r.syncSession?.uploadAllLocalChanges();
})
    .catch(catchError)
    .finally(() => console.log('DONE!'));
