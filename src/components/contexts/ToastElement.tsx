import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { $cn } from '../../util/$cn';
import { faBug, faNewspaper, faThumbsUp, faTrafficCone } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggler } from '../../hooks/useToggler';
import { Toast, ToastStage, cycleToastStage, toastColors } from './ToasterContext';
import { randomString } from '../../util/randomString';

export function ToastElement({ message, title, toastType, prune }: Toast) {
    const [stage, setStage] = useState<ToastStage>('animating-in');
    const triggerCycler = useCallback(() => setStage(cycleToastStage), []);
    const onAnimationEnd = useCallback(() => setStage((prev) => {
        if (prev === 'animating-in' || prev === 'animating-out') return cycleToastStage(prev);
        return prev;
    }), []);
    const [isPinned, togglePinned] = useToggler(false);
    const triggerCallback = useCallback(() => {
        token.current = setTimeout(() => {
            token.current = undefined;
            triggerCycler();
        }, 8000);
    }, [triggerCycler]);
    useEffect(() => {
        if (isPinned) {
            setStage('waiting');
            if (token.current) clearTimeout(token.current);
        }
    }, [isPinned, stage, triggerCallback]);
    const { className } = useMemo(
        () =>
            $cn(
                {} as { className?: string },
                {
                    animate__bounceInDown: stage === 'animating-in',
                    animate__fadeOutLeft: stage === 'animating-out',
                    // hidden: stage === 'expired' || stage === 'initialize',
                },
                'flex animate__animated w-full flex-row',
                toastColors[toastType]
            ),
        [stage, toastType]
    );
    console.log(`props`, className);
    const token = useRef<NodeJS.Timeout | undefined>(undefined);
    useEffect(() => {
        if (stage === 'waiting' && !isPinned) {
            triggerCallback();
        }
    }, [isPinned, stage, triggerCallback]);
    useEffect(() => {
        if (token.current && stage === 'expired') {
            clearTimeout(token.current);
            token.current = undefined;
        }
    }, [stage]);
    const onClick = useCallback(() => {
        if (stage !== 'animating-out' && stage !== 'expired') {
            if (token.current) {
                clearTimeout(token.current);
            }
            setStage('animating-out');
        }
    }, [stage]);
    const ref = useRef<HTMLDivElement | null>(null);
    const selfDestruct = useCallback(() => {
        if (ref.current != null) {
            ref.current.remove();
            prune();
        }
    }, [prune]);
    useEffect(() => {
        if (stage === 'expired') {
            selfDestruct();
        }
    }, [selfDestruct, stage]);
    const icon = toastType === 'success' ? faThumbsUp : toastType === 'error' ? faBug : toastType === 'info' ? faNewspaper : toastType === 'failure' ? faTrafficCone : undefined;

    const inputId = useMemo(() => randomString(24), []);
    return (
        <div ref={ref} className={className} onAnimationEnd={onAnimationEnd} onClick={onClick}>
            <span className='inline-flex p-0.5 items-center'>
                <FontAwesomeIcon className='object-scale-down inline-block w-16 h-16' icon={icon} />
            </span>
            <span className='inline-flex flex-grow w-full flex-col'>
                <header className='flex items-center justify-center uppercase font-extrabold font-grandstander text-2xl text-white bg-black'>{title}</header>
                <p className='items-center justify-start flex w-full p-0.5 border border-black px-1.5 text-lg'>{message}</p>
                <span className='flex justify-start ml-2 w-full'>
                    <label className='inline-flex text-lg text-black font-grandstander' htmlFor={inputId}>
                        SAVE and PIN this toast.
                    </label>
                    <input className='inline-flex text-lg' type='checkbox' defaultChecked={isPinned} onChange={togglePinned} id={inputId} />
                </span>
            </span>
        </div>
    );
}
