import { useEffect, useMemo } from 'react';
import { useOverlayContext } from './useOverlayContext';
import { Button } from '../Buttons/Button';
import { faWindowClose } from '@fortawesome/pro-solid-svg-icons';
import { $cn } from '../../util/$cn';
import { BoundingClientElement } from '../BoundingClientElement';

export function Overlay() {
    const { children, state, popFrame, cycleState } = useOverlayContext();
    const spread = useMemo(
        () =>
            $cn(
                {},
                {
                    animate__bounceInDown: state === 'showing',
                    animate__bounceOutUp: state === 'hiding',
                    hidden: state === 'hidden'
                },
                'relative flex items-center justify-center w-full h-full text-white border-2 border-white rounded-xl m-32 bg-yellow-700 animate__animated pointer-events-auto'
            ),
        [state]
    );
    useEffect(() => {
        if (children.length === 0 && state === 'shown') cycleState();
        if (children.length !== 0 && state === 'hidden') cycleState();
    }, [children.length, cycleState, state]);
    return (
        <div {...spread} onAnimationEnd={cycleState}>
            <Button icon={faWindowClose} className='absolute top-0 right-0 mt-1 mr-2' title='Close this window.' onClick={popFrame} />
            <BoundingClientElement>{children}</BoundingClientElement>
        </div>
    );
}
