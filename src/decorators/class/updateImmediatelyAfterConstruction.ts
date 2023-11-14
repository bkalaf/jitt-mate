
export function updateImmediatelyAfterConstruction(target: any, context: ClassDecoratorContext) {
    // console.log(context);
    // process.stdout.write(JSON.stringify(context, null, '\t'));
    // console.log(target);
    // console.log(target.constructor);
    // console.log(target.prototype);
    // const original = target;
    // function newCtor(...args: any[]) {
    //     const instance = new original(...args);
    //     return instance.update();
    // }
    // newCtor.prototype = original.prototype;
    // const toCopy = Object.getOwnPropertyNames(original);
    // console.error(toCopy);
    // toCopy.forEach(cpy => (newCtor as any)[cpy] = original[cpy])
    return target as typeof target;
}
