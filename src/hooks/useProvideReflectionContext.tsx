/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';
import { PropertySchema } from 'realm';
import { normalizeSchemaProperty } from '../dal/normalizeSchemaProperty';
import { IReflectionContext, CollectionRegistrar, CollectionRegistrarValue } from '../components/Contexts/ReflectionContext';

export function useProvideReflectionContext(): IReflectionContext {
    const [registrar, setRegistrar] = useState<CollectionRegistrar>({});
    const register = useCallback((ctor: EntityConstructor<EntityBase>) => {
        const schema = ctor.schema;
        const { name, embedded, properties, primaryKey, asymmetric } = schema;
        const propertiesRegistrar = Object.fromEntries(
            Object.entries(properties).map(([propertyName, osp]) => [propertyName, typeof osp === 'string' ? normalizeSchemaProperty(osp) : normalizeSchemaProperty(osp)] as [string, PropertySchema])
        );
        setRegistrar((prev) => {
            const { [name]: _current, ...remain } = prev;
            const fieldInfos = Object.entries(propertiesRegistrar)
                .filter(([k, v]) => v.objectType === 'productTaxonomy')
                .map(([k, { type, objectType }]) => [k, type, objectType] as FieldInfo);
            const newValue = [{ embedded, name, primaryKey, asymmetric }, propertiesRegistrar, fieldInfos] as CollectionRegistrarValue;
            return { ...remain, [name]: newValue };
        });
    }, []);
    const getIsEmbedded = useCallback(
        (name: string) => {
            return registrar[name][0].embedded ?? false;
        },
        [registrar]
    );
    const getProperties = useCallback(
        (name: string) => {
            return registrar[name][1];
        },
        [registrar]
    );
    const getFieldInfos = useCallback(
        (name: string) => {
            return registrar[name][2];
        },
        [registrar]
    );
    return {
        registrar,
        register,
        getIsEmbedded,
        getProperties,
        getFieldInfos
    };
}
