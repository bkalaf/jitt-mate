/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from 'react';
import { BaseObjectSchema, PropertySchema } from 'realm';

export type CollectionRegistrarValue = [baseSchema: Omit<BaseObjectSchema, 'properties'>, properties: PropertiesRegistrar, detailsFieldInfos: FieldInfo[]];
export type PropertiesRegistrar = Record<string, PropertySchema>;
export type CollectionRegistrar = Record<string, CollectionRegistrarValue>;
export type IReflectionContext = {
    registrar: CollectionRegistrar;
    register: (ctor: EntityConstructor<EntityBase>) => void;
    getIsEmbedded: (name: string) => boolean;
    getProperties: (name: string) => PropertiesRegistrar;
    getFieldInfos: (name: string) => FieldInfo[];
};

export const ReflectionContext = createContext<IReflectionContext | undefined>(undefined);
ReflectionContext.displayName = 'ReflectionContext';


