export function _(c: ClassFieldDecoratorContext | ClassMethodDecoratorContext | ClassDecoratorContext | ClassGetterDecoratorContext) {
    switch (c.kind) {
        case 'class':
            c.metadata as Record<string, any>;
            return c.metadata as Record<string, any>;
        case 'field':
        case 'getter': {
            if (c.metadata.fields == null) c.metadata.fields = {} as any;
            if ((c.metadata.fields as any)[c.name] == null) (c.metadata.fields as any)[c.name] = {};
            (c.metadata.fields as any)[c.name];
            const propField = (c.metadata.fields as Record<string, Record<string, any>>)[c.name.toString()];
            propField.memberType = c.kind;
            return propField;
        }
        case 'method':
            if (c.metadata[c.name] == null) c.metadata[c.name] = {} as any;
            c.metadata[c.name] as Record<string, any>;
            return c.metadata[c.name] as Record<string, any>;
    }
}
