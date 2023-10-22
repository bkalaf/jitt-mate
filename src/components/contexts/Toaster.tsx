import React from 'react';
import { useToasterContext } from '../../hooks/useToasterContext';


export function Toaster() {
    const { toasts } = useToasterContext();
    console.log(toasts);
    return <div className='absolute top-0 h-full left-3/4 w-1/6 bg-black-300 z-30 flex flex-col-reverse opacity-100' id='toaster-root'>
        {React.Children.toArray(toasts)}
    </div>;
}
