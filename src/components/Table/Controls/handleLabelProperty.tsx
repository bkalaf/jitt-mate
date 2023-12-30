import { Path } from 'react-hook-form-mui';


export function handleLabelProperty<TLookup>(labelProperty: Path<TLookup> | ((x: TLookup) => string)) {
    return function (obj: TLookup): string {
        if (labelProperty != null && typeof labelProperty === 'function') {
            return labelProperty(obj);
        }
        return obj[labelProperty as any as keyof TLookup] as any;
    };
}
