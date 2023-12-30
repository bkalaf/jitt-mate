
export function effective<T extends AnyObject, TValue extends T[keyof T]>(name: keyof T, left?: T, right?: T): TValue | undefined {
    return left != null && name in left ? left[name] : right != null && name in right ? right[name] : undefined;
}
