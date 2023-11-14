import { PropertySchema } from 'realm';
import { is } from './is';
import { ifOpt, ifList, ifDictionary, ifSet, ifPrimitive, handleIf } from '../dto/collections/MercariSubSubCategory';


export function normalizeSchemaProperty(sp: string | PropertySchema): PropertySchema {
    const result = [ifOpt, ifList, ifDictionary, ifSet, ifPrimitive].map(handleIf).reduce((pv, cv) => cv(pv), sp);
    if (is.string(result)) throw new Error(`could not normalize: ${sp}`);
    return result as PropertySchema;
}
