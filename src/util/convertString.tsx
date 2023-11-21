import { BSON } from 'realm';
import { catchError } from '../components/catchError';

export function convertString(key: string, s: string) {
    console.log(`key`, key, s);
    function inner() {
        try {
            const regex = /^[0-9]{4}[-][0-1][0-9][-][0-3][0-9](T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{3}Z)?)?$/;
            if (!regex.test(s)) throw new Error('NOT A DATE');
            return new Date(Date.parse(s));
        } catch (error) {
            catchError(error);
            try {
                if (s.length !== 24) throw new Error('not an OID');
                const oid = new BSON.ObjectId(s);
                return oid;
            } catch (error) {
                catchError(error);
                try {
                    if (!(s.length === 32 || s.length === 36)) throw new Error('not an UUID');
                    const uuid = new BSON.UUID(s);
                    return uuid;
                } catch (error) {
                    catchError(error);
                    return s.trim();
                }
            }
        }
    }
    const result = inner();
    console.log('result', result);
    return result;
}
