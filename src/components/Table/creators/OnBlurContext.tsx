import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IOnBlurContext = (name: string) => (ev: React.FocusEvent<any>) => void;

export const OnBlurContext = createContext<IOnBlurContext | undefined>(undefined);
OnBlurContext.displayName = 'OnBlurContext';
