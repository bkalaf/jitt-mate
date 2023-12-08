import { createContext } from 'react';

export type IOnBlurContext = (name: string) => (ev: React.FocusEvent<any>) => void;

export const OnBlurContext = createContext<IOnBlurContext | undefined>(undefined);
OnBlurContext.displayName = 'OnBlurContext';
