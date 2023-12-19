import { createContext } from 'react';

export type ILocalForageContext = {
    forager: LocalForage;
};

export const LocalForageContext = createContext<ILocalForageContext | undefined>(undefined);
LocalForageContext.displayName = 'LocalForageContext';
