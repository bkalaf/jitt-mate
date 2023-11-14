import { is } from '../../../dal/is';

export function render<T>(obj: T | undefined | ((props: AnyObject) => JSX.Element), props: any) {
    console.log(`render`, typeof obj, obj);
    try {
        console.log('name', (obj as any).name);
    } catch (error) { /* empty */ }
    if (obj == null) return null;
    if (typeof obj === 'string') return obj;
    if (is.func(obj)) {
        const Obj = obj;
        return <Obj {...props} />;
    }
    console.error(`cannot render`, obj);
    throw new Error('cannot render');
}
