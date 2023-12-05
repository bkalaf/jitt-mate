import { is } from '../dal/is';


export function tapOr<T, TArgs extends AnyArray>(funcOr?: T | ((...x: TArgs) => T)) {
    return (...args: TArgs) => (funcOr == null ? undefined : is.func<(...args: TArgs) => T>(funcOr) ? funcOr(...args) : (funcOr as T));
}
