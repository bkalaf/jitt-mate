import {
    withHeaderDecorator,
    withInputElementDecorator,
    withAutoHeaderDecorator,
    $$string,
    withTextTypeInputDecorator,
    $$autoAccessorKey,
    $$maxLength,
    $$minLength,
    $$pattern,
    $$isRequired,
    $$accessorFnDBListDecorator,
    asListDecorator,
    withAutoIDDecorator,
    $$ctor,
    $$object,
    asLookupObjectDecorator
} from '../../decorators/field/baseMetaDecorator';
import { withLabelPropertyDecorator } from '../../schema/decorators/labelProperty';
import { pipeDecorators } from '../../schema/pipeDecorators';
import { MercariSubCategory } from './MercariSubCategory';

export const basicTextboxDecorator = function <T>(opts?: { max?: number; min?: number; pattern?: RegExp; required?: boolean }, header?: string) {
    const { min, max, pattern, required } = opts ?? {};
    const pipes = [
        ...(max ? [$$maxLength(max)] : []),
        ...(required ? [$$isRequired] : []),
        ...(min ? [$$minLength(min)] : []),
        ...(pattern ? [$$pattern(pattern.toString().substring(1, pattern.toString().length - 2))] : [])
    ];
    return pipeDecorators($$string, withInputElementDecorator, withTextTypeInputDecorator, $$autoAccessorKey, header ? withHeaderDecorator(header) : withAutoHeaderDecorator, ...pipes);
};

export function basicListDecorator(ot: RealmObjects | RealmTypes) {
    return pipeDecorators($$accessorFnDBListDecorator, asListDecorator(ot), withAutoHeaderDecorator, withAutoIDDecorator);
}

export function basicLookupDecorator(ctor: EntityConstructor<any>, labelProperty: string, { header }: { header?: string } = {}) {
    const opts = [...(header ? [withHeaderDecorator(header)] : [withAutoHeaderDecorator])];
    return pipeDecorators($$object(ctor.schema.name as RealmObjects), withLabelPropertyDecorator(labelProperty), asLookupObjectDecorator, $$autoAccessorKey, $$ctor(ctor), ...opts);
}
