import { useMemo } from 'react';
import { randomString } from '../../../util/randomString';


export function useRandomID() {
    return useMemo(() => randomString(24), []);
}
