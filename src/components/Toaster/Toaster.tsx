import React from 'react';
import { useToasterContext } from '../../hooks/useToasterContext';

export function Toaster() {
    const { toasts } = useToasterContext();
    console.log(toasts);
    return (
        <div className='absolute top-0 z-30 flex flex-col-reverse w-1/6 h-full opacity-100 pointer-events-none left-3/4 bg-black-300' id='toaster-root'>
            {React.Children.toArray(toasts)}
        </div>
    );
}
