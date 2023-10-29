export function subExpected(type: RealmTypes) {
    return type === 'enum' ? 'string' : type;
}
