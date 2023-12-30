import { konst } from '../../common/functions/konst';
import { useFormContext } from 'react-hook-form';


export function useHandleEnumMapOrFunction(enumMap: EnumMapOrFunction) {
    const [propertyName, func] = Array.isArray(enumMap) ? enumMap : [undefined, konst(enumMap) as (value: string) => EnumMap<string, string>];
    const { watch } = useFormContext();
    const value = propertyName ? watch(propertyName) : undefined;
    return func(value);
}
