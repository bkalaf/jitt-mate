import { not } from '../not';

export function opposite<T, U>(func: (x: T) => (y: U) => boolean) {
    return (x: T): (<U>(y: U) => boolean) => not(func(x));
}
