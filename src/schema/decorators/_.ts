export function _(c: ClassFieldDecoratorContext | ClassMethodDecoratorContext) {
    if (c.metadata[c.name] == null) c.metadata[c.name] = {} as any;
    return c.metadata[c.name] as Record<string, any>;
}

export function 