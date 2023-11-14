import { strategy, wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { baseMetaDecorator } from '../../decorators/field/baseMetaDecorator';

export function withLabelPropertyDecorator<T extends Record<string, string>>(prop: keyof T) {
    return baseMetaDecorator('labelProperty', strategy.constant(prop))
}
